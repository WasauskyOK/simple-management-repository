import inquirir from "inquirer";
import { exec } from "promisify-child-process";
import fetch from "node-fetch";
console.log(`

  ██╗     ██╗███████╗████████╗    ██████╗ ██╗   ██╗██████╗ ██╗     ██╗ ██████╗    ██████╗ ███████╗██████╗  ██████╗ ███████╗██╗████████╗ ██████╗ ██████╗ ██╗███████╗███████╗
  ██║     ██║██╔════╝╚══██╔══╝    ██╔══██╗██║   ██║██╔══██╗██║     ██║██╔════╝    ██╔══██╗██╔════╝██╔══██╗██╔═══██╗██╔════╝██║╚══██╔══╝██╔═══██╗██╔══██╗██║██╔════╝██╔════╝
  ██║     ██║███████╗   ██║       ██████╔╝██║   ██║██████╔╝██║     ██║██║         ██████╔╝█████╗  ██████╔╝██║   ██║███████╗██║   ██║   ██║   ██║██████╔╝██║█████╗  ███████╗
  ██║     ██║╚════██║   ██║       ██╔═══╝ ██║   ██║██╔══██╗██║     ██║██║         ██╔══██╗██╔══╝  ██╔═══╝ ██║   ██║╚════██║██║   ██║   ██║   ██║██╔══██╗██║██╔══╝  ╚════██║
  ███████╗██║███████║   ██║       ██║     ╚██████╔╝██████╔╝███████╗██║╚██████╗    ██║  ██║███████╗██║     ╚██████╔╝███████║██║   ██║   ╚██████╔╝██║  ██║██║███████╗███████║
  ╚══════╝╚═╝╚══════╝   ╚═╝       ╚═╝      ╚═════╝ ╚═════╝ ╚══════╝╚═╝ ╚═════╝    ╚═╝  ╚═╝╚══════╝╚═╝      ╚═════╝ ╚══════╝╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
  `);
console.log(`
┌┐ ┬ ┬  ┌─┐┬ ┬┌─┐┌─┐ ┬ ┬┌─┐┌─┐┌─┐┬ ┬┬─┐┬ ┬┌─┐
├┴┐└┬┘  │  ├─┤│ ││─┼┐│ │├┤ └─┐├─┤│ │├┬┘│ │└─┐
└─┘ ┴   └─┘┴ ┴└─┘└─┘└└─┘└─┘└─┘┴ ┴└─┘┴└─└─┘└─┘
  `);

(async () => {
  let nombre = await inquirir.prompt({
    type: "input",
    name: "usuario_github",
    message: "¿Cual es tu nombre de usuario de github ?: ",
    default: "",
    // default:"Carpeta_"+new Date().toLocaleString().replace(/\//g,"-")
  });
  const request_list_repositories = await (
    await fetch(`https://api.github.com/users/${nombre.usuario_github}/repos`)
  ).json();
  const parsing = JSON.parse(
    JSON.stringify(request_list_repositories, ["name"])
  );
  const filter_alone_name_repository = parsing.map((item) => item.name);

  const validate_clone_One_or_multi = await inquirir.prompt({
    type: "list",
    name: "validate",
    message: "¿Vas a clonar un solo repositorio o varios?: ",
    choices: ["Solo un repositorio", "Varios repositorios"],
    default: "",
    // default:"Carpeta_"+new Date().toLocaleString().replace(/\//g,"-")
  });
  if (validate_clone_One_or_multi.validate === "Solo un repositorio") {
    inquirir
      .prompt({
        type: "rawlist",
        name: "repository",
        message: "escoge el repositorio a clonar : ",
        choices: filter_alone_name_repository,
        default: [],
        // default:"Carpeta_"+new Date().toLocaleString().replace(/\//g,"-")
      })
      .then(async (data) => {
        if (data.repository === []) {
          console.log("No no has seleccionado algun repositorio");
        } else {
          let url = `git@github.com:${nombre.usuario_github}/${data.repository}.git`;
          await exec(`git clone ${url}`);
          console.log("Clonacion exitosa :D ");
        }
      });
  } else {
    inquirir
      .prompt({
        type: "checkbox",
        name: "repository",
        message: "escoge el repositorio a clonar : ",
        choices: filter_alone_name_repository,
        default: [],
        // default:"Carpeta_"+new Date().toLocaleString().replace(/\//g,"-")
      })
      .then((data) => {
        if (data.repository === []) {
          console.log("No no has seleccionado algun repositorio");
        } else {
          data.repository.forEach(async (item) => {
            let url = `git@github.com:${nombre.usuario_github}/${item}.git`;
            await exec(`git clone ${url}`);
          });
          console.log("Clonacion exitosa :D ");
        }
      });
  }
})();
