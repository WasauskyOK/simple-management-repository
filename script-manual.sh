echo "Installing dependencies :D , One moment : "
apt-get update -y
apt-get install -y apt-utils
apt-get install -y figlet
apt install curl -y
apt-get install -y jq
apt install bash-completion
apt install git -y
apt-get update -y
figlet Bienvenido a List Repositories By : choquesaurus
read -p  "Ingresa tu usuariode github : " usuario
echo $usuario
#lista=$(curl https://prueba.free.beeceptor.com/list)
#curl -s https://api.github.com/users/wasauskyok/repos |jq '.[]|.name' > texto.txt
lista=$(curl -s https://api.github.com/users/$usuario/repos  |jq '.[].name')
select item in ${lista[@]} salir
do
	if [ $item == salir ]
	then
		#echo "salirr xdd $item"
	   	read -p "Deseas salir si o nel , ingresa y o n : "  opcion
		#echo "$seleccionar"
		exit
	else
	lngmax="${#item}"
	extraction="${item:1:$((lngmax-2))}"
	#echo "$lngmax"
	echo "Has seleccionado $extraction"
	git clone  git@github.com:$usuario/$extraction.git
	cd $extraction
	curl -s  https://prueba.free.beeceptor.com/envdata -o .env 
	echo "Abriendo proyecto :D "
	code .
	#npm install || yarn
	fi
done
