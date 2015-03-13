
$(document).ready(function() {
    $('#fullpage').fullpage();
    init();
    String.prototype.endsWith = function(suffix) {
    	return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};
});

/*calculo de mezcla*/
function calcular_mezcla(peso_molecular,viscosidad,fijx){
	return (peso_molecular * viscosidad) / fijx
}

/*Calculo de fi*/
// formula (1/√8)(1+(Mi/Mj)^-(1/2)[1+(Miu(i)/Miu(j))^(1/2)(Mj/Mi)^(1/4)]^2
function calculo_fi(mi,mj,miui,miuj,peso){
	mimj = mi/mj;
	miuimiuj = miui/miuj;
	mjmi = mj/mi;
	return peso*(1 / Math.sqrt(8))*(1+Math.pow(mimj,-0.5)*Math.pow((1+Math.pow(miuimiuj,-0.5)*(Math.pow(mjmi,0.25))),2));
}

function calcular(sustancias,temp){
	for(var i = 0; i < sustancias.length; i++){
		sustancias[i]["miu"] = calcula_miu(sustancias[i].name, sustancias[i].peso,temp);
	}
	for(var i = 0; i < sustancias.length; i++){
		var temp_fi = 0;
		for(var j = 0; j < sustancias.length; j++){
			de_i = sustancias[i];
			de_j = sustancias[j];
			temp_fi += calculo_fi(de_i.peso,de_j.peso,de_i.miu,de_j.miu,de_i.fracc);
		}
		sustancias[i].fi = temp_fi;
	}
	peso = 0;
	for(var i = 0; i < sustancias.length; i++){
		peso += calcular_mezcla(sustancias[i].peso,sustancias[i].miu,sustancias[i].fi);
	}
	alert("kek, al final fue > "+peso);
	$(".respuesta").text("Peso: "+peso);
	return false;
}
/*Calculo de miu*/
function constante_viscosidad(){
	return 0.000026693;
}
function obtener_omega_miu(temperatura,ek){
	aprox_miu = temperatura / ek;
	return check_omegas(aprox_miu);
}
function calcula_miu(sustancia,peso_molecular,temperatura){
	viscosidad = constante_viscosidad();
	tabla_b1 = obtener_tabla_b1();
	parametros = parametros_lennard_jones(sustancia,tabla_b1);
	sigma = Math.pow(parametros.sigma,2);
	ek = parametros.EK;
	omega_miu = obtener_omega_miu(temperatura,ek);
	return (viscosidad * (Math.sqrt(peso_molecular*temperatura)) / (sigma * omega_miu));
}
function parametros_lennard_jones(sustancia,tabla){
	for(var group in tabla){
	   if(tabla.hasOwnProperty(group)){
	      group = tabla[group.toString()];
	      for(elem in group.elementos){
	      		element = group.elementos[elem];
				if(sustancia == element.sustancia){
					return element;
				}
			}
	    }     
	}
}
function obtener_tabla_b1(){
	//return {"ligeros":{"elementos":[{"sustancia":"h2","M":2.016,"sigma":2.915,"EK":38},{"sustancia":"he","M":4.003,"sigma":2.576,"EK":10.2}]},"nobles":{"elementos":[{"sustancia":"ne","M":20.183,"sigma":2.789,"EK":35.7},{"sustancia":"ar","M":39.944,"sigma":3.418,"EK":124},{"sustancia":"kr","M":83.8,"sigma":3.498,"EK":225},{"sustancia":"Xe","M":131.3,"sigma":4.055,"EK":229}]},"sencillas":{"elementos":[{"sustancia":"x","M":0,"sigma":0,"EK":0}]},"hidrocarburos":{"elementos":[{"sustancia":"X","M":0,"sigma":0,"EK":0}]},"otros":{"elementos":[{"sustancia":"X","M":0,"sigma":0,"EK":0}]}};
	return {"ligeros":{"elementos":[{"sustancia":"h2","M":2.016,"sigma":2.915,"EK":38},{"sustancia":"he","M":4.003,"sigma":2.576,"EK":10.2}]},"nobles":{"elementos":[{"sustancia":"ne","M":20.183,"sigma":2.789,"EK":35.7},{"sustancia":"ar","M":39.944,"sigma":3.418,"EK":124},{"sustancia":"kr","M":83.8,"sigma":3.498,"EK":225},{"sustancia":"xe","M":131.3,"sigma":4.055,"EK":229}]},"sencillas":{"elementos":[{"sustancia":"aire","M":28.97,"sigma":3.617,"EK":97},{"sustancia":"n2","M":28.02,"sigma":3.681,"EK":91.5},{"sustancia":"o2","M":32,"sigma":3.433,"EK":113},{"sustancia":"co","M":28.01,"sigma":3.59,"EK":110},{"sustancia":"co2","M":44.01,"sigma":3.996,"EK":190},{"sustancia":"no","M":30.01,"sigma":3.47,"EK":119},{"sustancia":"n2o","M":44.02,"sigma":3.879,"EK":220},{"sustancia":"so2","M":64.07,"sigma":4.29,"EK":252},{"sustancia":"f2","M":38,"sigma":3.653,"EK":112},{"sustancia":"cl2","M":70.91,"sigma":4.115,"EK":357},{"sustancia":"br2","M":159.83,"sigma":4.268,"EK":520},{"sustancia":"i2","M":253.82,"sigma":4.982,"EK":550}]},"hidrocarburos":{"elementos":[{"sustancia":"ch4","M":16.04,"sigma":3.822,"EK":137},{"sustancia":"c2h2","M":26.04,"sigma":4.221,"EK":185},{"sustancia":"c2h4","M":28.05,"sigma":4.232,"EK":205},{"sustancia":"c2h6","M":30.07,"sigma":4.418,"EK":230},{"sustancia":"c3h8","M":44.09,"sigma":5.061,"EK":254},{"sustancia":"i‐c4h10","M":58.12,"sigma":5.341,"EK":313},{"sustancia":"n‐c5h12","M":72.15,"sigma":5.769,"EK":345},{"sustancia":"n‐c6h14","M":86.17,"sigma":5.909,"EK":413},{"sustancia":"n‐c8h18","M":114.22,"sigma":7.451,"EK":320},{"sustancia":"ciclohexano","M":84.16,"sigma":6.093,"EK":324},{"sustancia":"c6h6","M":78.11,"sigma":5.27,"EK":440}]},"otros":{"elementos":[{"sustancia":"ch3cl","M":50.49,"sigma":3.375,"EK":855},{"sustancia":"ch2cl2","M":84.94,"sigma":4.759,"EK":406},{"sustancia":"chcl3","M":119.39,"sigma":5.43,"EK":327},{"sustancia":"ccl4","M":153.84,"sigma":5.881,"EK":327},{"sustancia":"c2n2","M":52.04,"sigma":4.38,"EK":339},{"sustancia":"cos","M":60.08,"sigma":4.13,"EK":335},{"sustancia":"cs2","M":76.14,"sigma":4.438,"EK":488}]}};
}
function crear_tabla_b2(){
	//return {"omegas":[{"entrada":0.3,"valor":2.785},{"entrada":0.35,"valor":2.628},{"entrada":0.4,"valor":2.492},{"entrada":0.45,"valor":2.368},{"entrada":0.5,"valor":2.257},{"entrada":0.55,"valor":2.156},{"entrada":0.6,"valor":2.065},{"entrada":0.65,"valor":1.982},{"entrada":0.7,"valor":1.908},{"entrada":0.75,"valor":1.841},{"entrada":0.8,"valor":1.78},{"entrada":0.85,"valor":1.725},{"entrada":0.9,"valor":1.675},{"entrada":0.95,"valor":1.629},{"entrada":1,"valor":1.587},{"entrada":1.05,"valor":1.549},{"entrada":1.1,"valor":1.514},{"entrada":1.15,"valor":1.482},{"entrada":1.2,"valor":1.452},{"entrada":1.25,"valor":1.424},{"entrada":1.3,"valor":1.399},{"entrada":1.35,"valor":1.375},{"entrada":1.4,"valor":1.353},{"entrada":1.45,"valor":1.333},{"entrada":1.5,"valor":1.314},{"entrada":1.55,"valor":1.296},{"entrada":1.6,"valor":1.279},{"entrada":1.65,"valor":1.264},{"entrada":1.7,"valor":1.248},{"entrada":1.75,"valor":1.234},{"entrada":1.8,"valor":1.221},{"entrada":1.85,"valor":1.209},{"entrada":1.9,"valor":1.197},{"entrada":1.95,"valor":1.186},{"entrada":2,"valor":1.175},{"entrada":2.1,"valor":1.156},{"entrada":2.2,"valor":1.138},{"entrada":2.3,"valor":1.122},{"entrada":2.4,"valor":1.197},{"entrada":2.5,"valor":1.093},{"entrada":2.6,"valor":1.081},{"entrada":2.7,"valor":1.069},{"entrada":2.8,"valor":1.058},{"entrada":2.9,"valor":1.048},{"entrada":3,"valor":1.039},{"entrada":3.1,"valor":1.03},{"entrada":3.2,"valor":1.022},{"entrada":3.3,"valor":1.014},{"entrada":3.4,"valor":1.007},{"entrada":3.5,"valor":0.9999},{"entrada":3.6,"valor":0.9932},{"entrada":3.7,"valor":0.987},{"entrada":3.8,"valor":0.9811},{"entrada":3.9,"valor":0.9755},{"entrada":4,"valor":0.97},{"entrada":4.1,"valor":0.9649},{"entrada":4.2,"valor":0.96},{"entrada":4.3,"valor":0.9553},{"entrada":4.4,"valor":0.9507},{"entrada":4.5,"valor":0.9464},{"entrada":4.6,"valor":0.9422},{"entrada":4.7,"valor":0.9382},{"entrada":4.8,"valor":0.9343},{"entrada":4.9,"valor":0.9305},{"entrada":5,"valor":0.9269},{"entrada":6,"valor":0.8963},{"entrada":7,"valor":0.8727},{"entrada":8,"valor":0.8538},{"entrada":9,"valor":0.8379},{"entrada":10,"valor":0.8242},{"entrada":20,"valor":0.7432},{"entrada":30,"valor":0.7005},{"entrada":40,"valor":0.6718},{"entrada":50,"valor":0.6504},{"entrada":60,"valor":0.6335},{"entrada":70,"valor":0.6194},{"entrada":80,"valor":0.6076},{"entrada":90,"valor":0.5973},{"entrada":100,"valor":0.5882}]};
	window.tabla_b2 = {"1":1.587,"2":1.175,"3":1.039,"4":0.97,"5":0.9269,"6":0.8963,"7":0.8727,"8":0.8538,"9":0.8379,"10":0.8242,"20":0.7432,"30":0.7005,"40":0.6718,"50":0.6504,"60":0.6335,"70":0.6194,"80":0.6076,"90":0.5973,"0.3":2.785,"0.31":2.7536,"0.32":2.7222,"0.33":2.6908,"0.34":2.6593,"0.35":2.628,"0.36":2.6008,"0.37":2.5736,"0.38":2.5463,"0.39":2.5191,"0.4":2.492,"0.41":2.4672,"0.42":2.4424,"0.43":2.4176,"0.44":2.3928,"0.45":2.368,"0.46":2.3459,"0.47":2.3238,"0.48":2.3017,"0.49":2.2796,"0.5":2.257,"0.51":2.2369,"0.52":2.2168,"0.53":2.1967,"0.54":2.1766,"0.55":2.156,"0.56":2.1378,"0.57":2.1195,"0.58":2.1012,"0.59":2.0829,"0.6":2.065,"0.61":2.0484,"0.62":2.0319,"0.63":2.0153,"0.64":1.9988,"0.65":1.982,"0.66":1.9673,"0.67":1.9526,"0.68":1.9379,"0.69":1.9232,"0.7":1.908,"0.71":1.8946,"0.72":1.8813,"0.73":1.8679,"0.74":1.8545,"0.75":1.841,"0.76":1.8289,"0.77":1.8168,"0.78":1.8047,"0.79":1.7926,"0.8":1.78,"0.81":1.7691,"0.82":1.7582,"0.83":1.7473,"0.84":1.7364,"0.85":1.725,"0.86":1.715,"0.87":1.705,"0.88":1.695,"0.89":1.685,"0.9":1.675,"0.91":1.6658,"0.92":1.6565,"0.93":1.6473,"0.94":1.6381,"0.95":1.629,"0.96":1.6206,"0.97":1.6122,"0.98":1.6038,"0.99":1.5954,"1.01":1.5794,"1.02":1.5717,"1.03":1.5641,"1.04":1.5565,"1.05":1.549,"1.06":1.5421,"1.07":1.5352,"1.08":1.5283,"1.09":1.5214,"1.1":1.514,"1.11":1.5076,"1.12":1.5012,"1.13":1.4948,"1.14":1.4884,"1.15":1.482,"1.16":1.476,"1.17":1.47,"1.18":1.464,"1.19":1.458,"1.2":1.452,"1.21":1.4464,"1.22":1.4407,"1.23":1.4351,"1.24":1.4295,"1.25":1.424,"1.26":1.4191,"1.27":1.4142,"1.28":1.4093,"1.29":1.4044,"1.3":1.399,"1.31":1.3942,"1.32":1.3894,"1.33":1.3846,"1.34":1.3798,"1.35":1.375,"1.36":1.3707,"1.37":1.3664,"1.38":1.3621,"1.39":1.3578,"1.4":1.353,"1.41":1.349,"1.42":1.345,"1.43":1.341,"1.44":1.337,"1.45":1.333,"1.46":1.3293,"1.47":1.3256,"1.48":1.3218,"1.49":1.3181,"1.5":1.314,"1.51":1.3104,"1.52":1.3068,"1.53":1.3032,"1.54":1.2995,"1.55":1.296,"1.56":1.2926,"1.57":1.2892,"1.58":1.2857,"1.59":1.2823,"1.6":1.279,"1.61":1.2761,"1.62":1.2732,"1.63":1.2703,"1.64":1.2674,"1.65":1.264,"1.66":1.2608,"1.67":1.2575,"1.68":1.2543,"1.69":1.251,"1.7":1.248,"1.71":1.2452,"1.72":1.2424,"1.73":1.2396,"1.74":1.2368,"1.75":1.234,"1.76":1.2315,"1.77":1.229,"1.78":1.2265,"1.79":1.224,"1.8":1.221,"1.81":1.2186,"1.82":1.2162,"1.83":1.2138,"1.84":1.2114,"1.85":1.209,"1.86":1.2066,"1.87":1.2042,"1.88":1.2018,"1.89":1.1994,"1.9":1.197,"1.91":1.1949,"1.92":1.1928,"1.93":1.1907,"1.94":1.1886,"1.95":1.186,"1.96":1.1839,"1.97":1.1818,"1.98":1.1797,"1.99":1.1776,"2.01":1.1598,"2.1":1.156,"2.11":1.1415,"2.2":1.138,"2.21":1.1254,"2.3":1.0624,"2.4":1.1138,"2.5":1.093,"2.51":1.0834,"2.6":1.081,"2.61":1.0714,"2.7":1.069,"2.71":1.0606,"2.8":1.05,"2.9":1.0408,"3.01":1.032,"3.1":1.03,"3.11":1.0235,"3.2":1.022,"3.21":1.0154,"3.3":1.0083,"3.4":1.0012,"3.5":0.9999,"3.51":0.9947,"3.6":0.9932,"3.61":0.9884,"3.7":0.987,"3.71":0.9826,"3.8":0.9771,"3.9":0.9715,"4.01":0.969,"4.02":0.966,"4.1":0.9611,"4.2":0.96,"4.21":0.9591,"4.22":0.9561,"4.3":0.9553,"4.31":0.9517,"4.4":0.9507,"4.41":0.9499,"4.42":0.949,"4.43":0.9473,"4.5":0.9464,"4.51":0.9456,"4.52":0.9431,"4.6":0.939,"4.7":0.9382,"4.71":0.9375,"4.72":0.9353,"4.8":0.9343,"4.81":0.9314,"4.9":0.9305,"4.91":0.9298,"4.92":0.929,"4.93":0.9276,"5.01":0.9208,"5.02":0.9027,"6.01":0.8916,"6.02":0.8774,"7.01":0.869,"7.02":0.8578,"8.01":0.8507,"8.02":0.8476,"8.03":0.8445,"8.04":0.8414,"9.01":0.8351,"9.02":0.8323,"9.03":0.8296,"9.04":0.8269,"10.01":0.808,"10.02":0.7918,"10.03":0.7756,"10.04":0.7594,"20.01":0.7347,"20.02":0.7262,"20.03":0.7177,"20.04":0.7092,"30.01":0.6948,"30.02":0.689,"30.03":0.6832,"30.04":0.6775,"40.01":0.655,"50.01":0.6372,"60.01":0.6222,"70.01":0.6171,"70.02":0.6148,"70.03":0.6125,"70.04":0.6102,"80.01":0.6056,"80.02":0.6036,"80.03":0.6016,"80.04":0.5996,"90.01":0.5955,"90.02":0.5937,"90.03":0.5919,"90.04":0.5901};
}
function check_omegas(dato){
	if(window.tabla_b2 === undefined) crear_tabla_b2();
	num_search = to_fixed(dato,2).toString();
	if (num_search.endsWith("0") == true) {
		num_search = num_search.substring(0,num_search.length-1);
	} 
	omega_miu = window.tabla_b2[num_search];
	if(omega_miu === undefined){
		num_search = to_fixed(dato,1).toString();
		omega_miu = window.tabla_b2[num_search];
		console.log("No existe el valor para omega. "+dato.toString());
	}
	return omega_miu;	
}
function more_omegas(){
	b2 = obtener_tabla_b2();
	nuevo_b2 = {};
	nuevo_omega = [];
	incremento = 0.01;
	str = "";
	obj = {};
	for(var i = 0; i <= (b2.omegas.length-1); i++){
		if(b2.omegas[i+1] === undefined){ continue;}
		floor = b2.omegas[i].valor;
		ceiling = b2.omegas[i+1].valor;
		step = to_fixed((to_fixed((floor - ceiling),4)/5),4);
		next_val = to_fixed((floor - step),4);
		next_entrada = to_fixed((b2.omegas[i].entrada + incremento),2);
		nuevo_omega.push(b2.omegas[i]);
		obj[b2.omegas[i].entrada.toString()] = floor;
		obj[next_entrada] = next_val;
		for(var j = (i+1); j <= (i+4); j++){
			obj[next_entrada.toString()] = next_val; 
			nuevo_omega.push({"entrada":next_entrada,"valor": next_val}); 
			next_entrada = to_fixed((next_entrada + incremento),2);
			next_val = to_fixed((next_val - step),4);

		}
	}
	console.log(JSON.stringify(obj));
	return nuevo_omega;
}
function to_fixed(num,digit) {
    var re = new RegExp("(\\d+\\.\\d{" + digit + "})(\\d)"),
        m = num.toString().match(re);
    return m ? parseFloat(m[1]) : num.valueOf();
}

function init(){
	$(".add-sus").click(function(){
		add_sus();
	});
	$(".del-sus").hide();
	$("#kek").find("[type=submit]").click(function(){
		stg = "";
		flag = true;
		sustancias = [];
		$(".sustancias").each(function(){
			sust = {};
			sust["name"] = $(this).find("#sust_name").val().toLowerCase();
			sust["peso"] = $(this).find("#peso_molar").val();
			sust["fracc"] = $(this).find("#fracc_molar").val();
			if(sust["name"] == "" || sust["peso"] == "" || sust["fracc"] == "" ){
				stg = "No puedes dejar campos vacios";
				flag =  false;
			}
			sustancias.push(sust);
		});
		temp = $("#temp").val().trim();
		if (temp == ""){
			stg = "Falta agregar una temperatura";
			flag =  false;
		}
		if (flag == true){
			calcular(sustancias,temp);
		}else{
			alert(stg);
		}
		return flag;
	});
}

function add_sus(){
	clon = $(".sustancias").last().clone();
	nuevo_id = $(clon).data("id") + 1;
	$(clon).attr("data-id",nuevo_id);
	$(clon).find("#sust_name").val("");
	$(clon).find("#peso_molar").val("");
	$(clon).find("#fracc_molar").val("");
	$(clon).find(".del-sus").css("display","inline-block");
	$(".sustancias").last().after(clon);
	$(".sustancias").last().find(".add-sus").click(add_sus);
	$(".sustancias").last().find(".del-sus").click(function(){
		remove_sus(this);
	});
}
function remove_sus(self){
	$(self).parent("div").parent("div").remove();
}