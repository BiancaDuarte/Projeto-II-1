var db ='http:localhost:3000/product/'
var aux =0;

function tableclean(){
	$("#tabela").html("");
}

function ativos(){//selecionando status como ativo
	var status='A';
	leituraDados(status);
}

function inativos(){//selecionando status como inativo
	var status='I';
	leituraDados(status);
}

function tabelatoda(){//realiza a leitura da tabela sem distinção de status
	var status=0
	leituraDados(status);
}

function limparCamposForm(){
	$('#alerta').fadeOut('fast');
    $('#nome').val('');
    $('#valor').val('');
    $('#status').val('A');
    $('#estoque').val('');
}
function mudartitulo(estado) {//Função que muda o título da página
	if(estado=="A"){
		$('#titulo').html("Lista de Itens Ativos em Estoque:");
	}else if(estado=="I"){
		$('#titulo').html("Lista de Itens Inativos em Estoque:");
	
	}else{
		$('#titulo').html("Lista de Produtos em Estoque:");
	}
}
function ajax(tipo, url, msg, dados){//requisição ajax 

	$.ajax({
		type: tipo,
 		url: url,
 		data: dados,
        success: function(){
			avisos(msg);
			tabelatoda();
		},
		error: function(){
			msg=("Ops! Algo deu errado, tente novamente!");
			avisos(msg);
		}
	})
	// $('#modalconfirma').modal(options)	
}

function avisos(msg){//cria um alert depois das operações
	$('#aviso').fadeIn('fast', function(){
	});
	$( "#textoaviso" ).html("<h1>"+msg+"</h1>");
	$('#aviso').fadeOut(1500, function(){
	});

}

function maskmoney(){
	   $("input#valor").maskMoney({showSymbol:true, symbol:"R$", decimal:".", thousands:","});
}

// $(#modal).modal(hide) para esconder. Ler documentação http://getbootstrap.com/javascript/#modals
function idmodaledit(bot){
	$("#editar").data('item', bot);
}

function idmodaldel(btn){
	$("#confirmaapagar").data('item', btn);

}

function apagar(btn){ 
	var id = $(btn).data("item");
	msg=("Produto excluido com sucesso!");
	ajax("DELETE", db+id,msg);	
}

function mudamodaladit(){
	$( "#modaltitulo" ).html( "Adicionar produto" );
	$("#adicionar").show();
	$("#editar").hide();
}

function mudamodaledit(){
	$( "#modaltitulo" ).html( "Editar produto" );
	$("#editar").show();
	$("#adicionar").hide();
}

function salvarnovosdados(metodo, btn){

	var codigo = $(btn).data("item");
	console.log(codigo)
	var NOME =$('#nome').val();
	var VALOR = $('#valor').val();
	var STATUS = $('#status').val();
	var ESTOQUE = $('#estoque').val();


	if(metodo=="POST"){
	
		var dados= {
			nome: NOME,
			valor: VALOR,
			status: STATUS,
			estoque: ESTOQUE};

		var msg=("Produto adicionado com sucesso!")
		ajax("POST",db,msg,dados);
		limparCamposForm()
		$('#modal').modal('hide');
		
	}else if (metodo=="PUT") {

		var dados= {
			nome: NOME,
			valor: VALOR, 
			status: STATUS , 
			estoque: ESTOQUE};

		var msg=("Produto editado com sucesso!")
		ajax("PUT",db+codigo,msg,dados);
		limparCamposForm()
		$('#modal').modal('hide');
	}

}
function procuraigual(){
	var teste

	$.get(db, function(data) {
		for(var i=0; i<data.length; i++){
			if($("#nome").val().toLowerCase()==data[i].nome.toLowerCase()) {
				exibiraviso("2");
				teste= 0;
			}
		}
	if (teste != 0) {
		console.log("teste");
		salvarnovosdados("POST");
	}
});
}	

function confereform(tipo,btn){
	if(($("#nome").val()=="")||($("#valor").val()=="")||($("#status").val()=="")||($("#estoque").val()=="")){
		exibiraviso("1");
	}else{
		if(tipo=="PUT"){
			salvarnovosdados(tipo,btn);
		}else{
			procuraigual();
		}
	}
}


function exibiraviso(aten){
	alert(aten);
	if(aten==1){
	    $('#alerta').fadeIn('fast', function(){
	        $('#alerta').fadeIn('fast');
	    });
	    $( "#textoalerta" ).html( "ATENÇÃO! Todos os campos devem ser preenchidos" );
	}
	if(aten==2){
	    $('#alerta').fadeIn('fast', function(){
	        $('#alerta').fadeIn('fast');
	    });
	    $( "#textoalerta" ).html( "ATENÇÃO! Este produto já consta em nossos registros" );
	}
}


function coletardadostabela(btn){
	
	var id = $(btn).parents('tr').data("id");
	var NOME= $(btn).parents('tr').data("nome");
	var VALOR = $(btn).parents('tr').data("valor");
 	var STATUS = $(btn).parents('tr').data("status");
 	var ESTOQUE = $(btn).parents('tr').data("estoque");
 	preencher(NOME,VALOR,STATUS,ESTOQUE)
}

function preencher(nome,valor,status,estoque){

	$("#nome").val(nome);
	$("#valor").val(valor);
	$("#status").val(status);
	$("#estoque").val(estoque);
}

function leituraDados(estado){

	tableclean();
	mudartitulo(estado);
	var status
	$.get(db, function(dados){
		for(var i=0;i<dados.length;i++){ //Adicionando registros retornados na tabela

			valor= dados[i].valor
			valor=(parseFloat(valor).toFixed(2));
			console.log(valor);
			
			if(dados[i].status==estado){
				if (dados[i].status=="A"){
					status='<h4><span class="glyphicon glyphicon-ok-sign "></span>  Ativo</h4>'
				}else{
					status='<h4><span class="glyphicon glyphicon-remove-sign"></span>  Inativo</h4>'
				}
			
				$('#tabela').append('<tr data-id="'+dados[i].id
				+'"data-nome="'+dados[i].nome
				+'"data-valor="'+valor
				+'"data-status="'+dados[i].status
				+'"data-estoque="'+dados[i].estoque
				+'"><td>'+dados[i].id
				+'</td><td>'+dados[i].nome
				+'</td><td>R$ '+valor.toString().replace(".", ",")
				+'</td><td>'+status
				+'</td><td>'+dados[i].estoque
				+'</td><td>'
				+'<button type="button" data-toggle="modal" data-target="#modalapagar" class="btn btn-default btn-lg delete"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>'
				+'</td><td>'
				+'<button type="button" data-toggle="modal" data-target="#modal"" class="btn btn-default btn-lg editar" ><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>'+'</td></tr>');
		
			}else if(estado==0){
				if (dados[i].status=="A"){
					status='<h4><span class="glyphicon glyphicon-ok-sign "></span>  Ativo</h4>'
				}else{
					status='<h4><span class="glyphicon glyphicon-remove-sign"></span>  Inativo</h4>'
				}
			
				$('#tabela').append('<tr data-id="'+dados[i].id
				+'"data-nome="'+dados[i].nome
				+'"data-valor="'+valor
				+'"data-status="'+dados[i].status
				+'"data-estoque="'+dados[i].estoque
				+'"><td>'+dados[i].id
				+'</td><td>'+dados[i].nome
				+'</td><td>R$ '+valor.toString().replace(".", ",")
				+'</td><td>'+status
				+'</td><td>'+dados[i].estoque
				+'</td><td>'
				+'<button type="button" data-toggle="modal" data-target="#modalapagar" class="btn btn-default btn-lg delete"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>'
				+'</td><td>'
				+'<button type="button" data-toggle="modal" data-target="#modal"" class="btn btn-default btn-lg editar" ><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>'+'</td></tr>');
			}
		
		}
	});
}

function actions(){
	$('#A').click(function(){
		ativos();
	});

	$('#I').click(function(){
		inativos();
	});

	$('#tabela').on("click", ".delete", function(){
		var btn = $(this).parents('tr').data('id');
		idmodaldel(btn);
	});

	$('#confirmaapagar').click(function(){
		apagar(this);
	});
	$('#mais').click(function(){
		limparCamposForm();
		mudamodaladit();
	});

	$('#adicionar').click(function(){
		confereform("POST",this);
	});

	$('#tabela').on("click", ".editar", function(){
		var bot = $(this).parents('tr').data('id');
		limparCamposForm();
		mudamodaledit();
		coletardadostabela(this);
		idmodaledit(bot);

	});

	$('#editar').click(function(){
		confereform("PUT",this);
	});

	$('#estoque').keyup(function () {
	    if (!this.value.match(/[0-9]/)) {
	        this.value = this.value.replace(/[^0-9]/g, '');
	    }
	});
	$("#nome").keyup(function(){
		var regexp = /[^a-zA-Z- çãõáéíóúàèÌòùâêîôûäëïüöÃÕÁÉÍÓÚÀÈÌÒÙÄÜÏÖËÂÊÎÔÛ]/g;
		if($(this).val().match(regexp)){
			$(this).val( $(this).val().replace(regexp,'') );
		}
	});



}

$(document).ready(function(){
	actions();
	tabelatoda();
	maskmoney();
})

// $(document).ready(function(){

// 	$.get('http://192.168.1.171:3000/product', function(dados){//Definindo o arquivo onde serão buscados os dados
		

// 		for(var i=0;i<dados.length;i++){
// 			//Adicionando registros retornados na tabela
// 			var valor = dados[i].valor
// 			valor=(parseFloat(valor).toFixed(2));// converte string em valor com ponto flutuante, fixando 2 casas após a vírgula e adionando zeros se necessário;

// 				$('#tabela').append('<tr data-id="'+dados[i].id+'"data-nome="'+dados[i].nome+'"data-valor="'+valor+'"data-status="'+dados[i].status+'"data-estoque="'+dados[i].estoque+'""><td>'+
// 				dados[i].id+'</td><td>'+dados[i].nome+'</td><td>R$ '+valor.toString().replace(".", ",")+'</td><td>'+dados[i].status+'</td><td>'+dados[i].estoque+'</td><td>'
// 				+'<button type="button" class="btn btn-default btn-lg delete"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>'+'</td><td>'+
// 				'<button type="button" data-toggle="modal" data-target="#modal"" class="btn btn-default btn-lg editar" onclick="preencher()" id="editar"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>'+'</td></tr>');
			
// 		}

// 	});
// 	apagar();
// });
// $(document).ready(function(){ //buscando apenas os itens ativos
// 	$("#ativos").mouseup(function(){
//    		$('#tabela').empty();
    
// 		$.get('http://192.168.1.171:3000/product', function(dados){//Definindo o arquivo onde serão buscados os dados
			

// 			for(var i=0;i<dados.length;i++){
// 				//Adicionando registros retornados na tabela
// 				var valor = dados[i].valor
// 				valor=(parseFloat(valor).toFixed(2));// converte string em valor com ponto flutuante, fixando 2 casas após a vírgula e adionando zeros se necessário;
		
// 				if(dados[i].status=="A"){
// 						$('#tabela').append('<tr data-id="'+dados[i].id+'"data-nome="'+dados[i].nome+'"data-valor="'+valor+'"data-status="'+dados[i].status+'"data-estoque="'+dados[i].estoque+'""><td>'+
// 							dados[i].id+'</td><td>'+dados[i].nome+'</td><td>R$ '+valor.toString().replace(".", ",")+'</td><td>'+dados[i].status+'</td><td>'+dados[i].estoque+'</td><td>'
// 							+'<button type="button" class="btn btn-default btn-lg delete"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>'+'</td><td>'+
// 							'<button type="button" data-toggle="modal" data-target="#modal"" class="btn btn-default btn-lg editar" onclick="preencher()" id="editar"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>'+'</td></tr>');
// 				}
// 			}
// 		});
// 	});
// 	apagar();

// });
// $(document).ready(function(){ //buscando apenas os itens inativos
// 	$("#inativos").mouseup(function(){
//    		$('#tabela').empty();
    
// 		$.get('http://192.168.1.171:3000/product', function(dados){//Definindo o arquivo onde serão buscados os dados
			

// 			for(var i=0;i<dados.length;i++){
// 				//Adicionando registros retornados na tabela
// 				var valor = dados[i].valor
// 				valor=(parseFloat(valor).toFixed(2));// converte string em valor com ponto flutuante, fixando 2 casas após a vírgula e adionando zeros se necessário;
		
// 				if(dados[i].status=="I"){
// 						$('#tabela').append('<tr data-id="'+dados[i].id+'"data-nome="'+dados[i].nome+'"data-valor="'+valor+'"data-status="'+dados[i].status+'"data-estoque="'+dados[i].estoque+'""><td>'+
// 							dados[i].id+'</td><td>'+dados[i].nome+'</td><td>R$ '+valor.toString().replace(".", ",")+'</td><td>'+dados[i].status+'</td><td>'+dados[i].estoque+'</td><td>'
// 							+'<button type="button" class="btn btn-default btn-lg delete"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>'+'</td><td>'+
// 							'<button type="button" data-toggle="modal" data-target="#modal"" class="btn btn-default btn-lg editar" onclick="preencher()" id="editar"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>'+'</td></tr>');
// 				}
// 			}
// 		});
// 	});
// });

// function apagar(){ 
// 	$('#tabela').on("click", ".delete", function(){
// 		if (confirm("Você tem certeza que deseja apagar este item?") == true) {// confirmando excluir
// 			 id = $(this).parents("tr").data("id");
// 			 $(this).parents("tr").remove();
// 			$.ajax({
// 				type: "DELETE",
// 				url: "http://192.168.1.171:3000/product/"+ id,
// 		 	})
// 		}
// 	});
// }

// function mais(){

// 		 NOME  =document.getElementById('nome').value;
// 		 VALOR = document.getElementById('valor').value;
// 		 STATUS = document.getElementById('status').value;
// 		 ESTOQUE = document.getElementById('estoque').value;
// 		 $.ajax({
// 	        type: 'POST',
// 	        dataType: 'json',
// 	        url: "http://192.168.1.171:3000/product/",
// 	        data: {nome: NOME, valor: VALOR, status: STATUS , estoque: ESTOQUE}
//    	 });
// 		 location.reload(true);
// }

// function preencher(){
// 		$('#tabela').on("click", ".editar", function(){
//   			var linha = $(this).parent().parent();
 		
//  			 id = $(this).parents('tr').data("id");
// 			NOME= $(this).parents('tr').data("nome");
// 			VALOR = $(this).parents('tr').data("valor");
//  			STATUS = $(this).parents('tr').data("status");
//  			ESTOQUE = $(this).parents('tr').data("estoque");
 			

//   			document.getElementById('nome').value = NOME;
//   			document.getElementById('valor').value = VALOR;
//   			document.getElementById('status').value = STATUS;
//   			document.getElementById('estoque').value = ESTOQUE;


// 		});

// }
// function editar (){

 		
// 		NOME  =document.getElementById('nome').value;
// 		VALOR = document.getElementById('valor').value;
// 		STATUS = document.getElementById('status').value;
// 		ESTOQUE = document.getElementById('estoque').value;
	
// 		$.ajax({
// 		    type: 'PUT',
// 		    dataType: 'json',
// 		    url: "http://192.168.1.171:3000/product/" +id,
// 		    data: {nome: NOME, valor: VALOR, status: STATUS , estoque: ESTOQUE}
// 		});
// 		location.reload(true);
// }

// function SomenteNumero(e){//aceitar somente número
//     var tecla=(window.event)?event.keyCode:e.which;   //pega o keycode das teclas clicadas
//     if((tecla>47 && tecla<58)||(tecla==46)) return true; //confere se estão dentro do parametro
//     else{
//     	if (tecla==8 || tecla==0) return true;
// 	else  return false;
//     }
// }
// function semmeio(e){//para manter estoque em inteiro
//     var tecla=(window.event)?event.keyCode:e.which;   
//     if((tecla>47 && tecla<58)) return true;
//     else{
//     	if (tecla==8 || tecla==0) return true;
// 	else  return false;
//     }
// }
// function SomenteLetras(e)
// 	{
// 		var expressao;//aceitar somente letra
// 		expressao = /[0-9]/;
// 		if(expressao.test(String.fromCharCode(e.keyCode)))
// 		{
// 			return false;
// 		}
// 		else
// 		{
// 			return true;
// 		}
// 	}
