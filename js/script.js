var NOME;
var VALOR; 
var STATUS;
var ESTOQUE;
var id;

$(document).ready(function(){

	$.get('http://192.168.1.171:3000/product', function(dados){//Definindo o arquivo onde serão buscados os dados
		

		for(var i=0;i<dados.length;i++){
			//Adicionando registros retornados na tabela
			var valor = dados[i].valor
			valor=(parseFloat(valor).toFixed(2));// converte string em valor com ponto flutuante, fixando 2 casas após a vírgula e adionando zeros se necessário;

				$('#tabela').append('<tr data-id="'+dados[i].id+'"data-nome="'+dados[i].nome+'"data-valor="'+valor+'"data-status="'+dados[i].status+'"data-estoque="'+dados[i].estoque+'""><td>'+
				dados[i].id+'</td><td>'+dados[i].nome+'</td><td>R$ '+valor.toString().replace(".", ",")+'</td><td>'+dados[i].status+'</td><td>'+dados[i].estoque+'</td><td>'
				+'<button type="button" class="btn btn-default btn-lg delete"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>'+'</td><td>'+
				'<button type="button" data-toggle="modal" data-target="#modal"" class="btn btn-default btn-lg editar" onclick="preencher()" id="editar"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>'+'</td></tr>');
			
		}

	});
	apagar();
});
$(document).ready(function(){ //buscando apenas os itens ativos
	$("#ativos").mouseup(function(){
   		$('#tabela').empty();
    
		$.get('http://192.168.1.171:3000/product', function(dados){//Definindo o arquivo onde serão buscados os dados
			

			for(var i=0;i<dados.length;i++){
				//Adicionando registros retornados na tabela
				var valor = dados[i].valor
				valor=(parseFloat(valor).toFixed(2));// converte string em valor com ponto flutuante, fixando 2 casas após a vírgula e adionando zeros se necessário;
		
				if(dados[i].status=="A"){
						$('#tabela').append('<tr data-id="'+dados[i].id+'"data-nome="'+dados[i].nome+'"data-valor="'+valor+'"data-status="'+dados[i].status+'"data-estoque="'+dados[i].estoque+'""><td>'+
							dados[i].id+'</td><td>'+dados[i].nome+'</td><td>R$ '+valor.toString().replace(".", ",")+'</td><td>'+dados[i].status+'</td><td>'+dados[i].estoque+'</td><td>'
							+'<button type="button" class="btn btn-default btn-lg delete"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>'+'</td><td>'+
							'<button type="button" data-toggle="modal" data-target="#modal"" class="btn btn-default btn-lg editar" onclick="preencher()" id="editar"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>'+'</td></tr>');
				}
			}
		});
	});
	apagar();

});
$(document).ready(function(){ //buscando apenas os itens inativos
	$("#inativos").mouseup(function(){
   		$('#tabela').empty();
    
		$.get('http://192.168.1.171:3000/product', function(dados){//Definindo o arquivo onde serão buscados os dados
			

			for(var i=0;i<dados.length;i++){
				//Adicionando registros retornados na tabela
				var valor = dados[i].valor
				valor=(parseFloat(valor).toFixed(2));// converte string em valor com ponto flutuante, fixando 2 casas após a vírgula e adionando zeros se necessário;
		
				if(dados[i].status=="I"){
						$('#tabela').append('<tr data-id="'+dados[i].id+'"data-nome="'+dados[i].nome+'"data-valor="'+valor+'"data-status="'+dados[i].status+'"data-estoque="'+dados[i].estoque+'""><td>'+
							dados[i].id+'</td><td>'+dados[i].nome+'</td><td>R$ '+valor.toString().replace(".", ",")+'</td><td>'+dados[i].status+'</td><td>'+dados[i].estoque+'</td><td>'
							+'<button type="button" class="btn btn-default btn-lg delete"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>'+'</td><td>'+
							'<button type="button" data-toggle="modal" data-target="#modal"" class="btn btn-default btn-lg editar" onclick="preencher()" id="editar"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>'+'</td></tr>');
				}
			}
		});
	});
});

function apagar(){ 
	$('#tabela').on("click", ".delete", function(){
		if (confirm("Você tem certeza que deseja apagar este item?") == true) {// confirmando excluir
			 id = $(this).parents("tr").data("id");
			 $(this).parents("tr").remove();
			$.ajax({
				type: "DELETE",
				url: "http://192.168.1.171:3000/product/"+ id,
		 	})
		}
	});
}

function mais(){

		 NOME  =document.getElementById('nome').value;
		 VALOR = document.getElementById('valor').value;
		 STATUS = document.getElementById('status').value;
		 ESTOQUE = document.getElementById('estoque').value;
		 $.ajax({
	        type: 'POST',
	        dataType: 'json',
	        url: "http://192.168.1.171:3000/product/",
	        data: {nome: NOME, valor: VALOR, status: STATUS , estoque: ESTOQUE}
   	 });
		 location.reload(true);
}

function preencher(){
		$('#tabela').on("click", ".editar", function(){
  			var linha = $(this).parent().parent();
 		
 			 id = $(this).parents('tr').data("id");
			NOME= $(this).parents('tr').data("nome");
			VALOR = $(this).parents('tr').data("valor");
 			STATUS = $(this).parents('tr').data("status");
 			ESTOQUE = $(this).parents('tr').data("estoque");
 			

  			document.getElementById('nome').value = NOME;
  			document.getElementById('valor').value = VALOR;
  			document.getElementById('status').value = STATUS;
  			document.getElementById('estoque').value = ESTOQUE;


		});

}
function editar (){

 		
		NOME  =document.getElementById('nome').value;
		VALOR = document.getElementById('valor').value;
		STATUS = document.getElementById('status').value;
		ESTOQUE = document.getElementById('estoque').value;
	
		$.ajax({
		    type: 'PUT',
		    dataType: 'json',
		    url: "http://192.168.1.171:3000/product/" +id,
		    data: {nome: NOME, valor: VALOR, status: STATUS , estoque: ESTOQUE}
		});
		location.reload(true);
}

function SomenteNumero(e){//aceitar somente número
    var tecla=(window.event)?event.keyCode:e.which;   //pega o keycode das teclas clicadas
    if((tecla>47 && tecla<58)||(tecla==46)) return true; //confere se estão dentro do parametro
    else{
    	if (tecla==8 || tecla==0) return true;
	else  return false;
    }
}
function semmeio(e){//para manter estoque em inteiro
    var tecla=(window.event)?event.keyCode:e.which;   
    if((tecla>47 && tecla<58)) return true;
    else{
    	if (tecla==8 || tecla==0) return true;
	else  return false;
    }
}
function SomenteLetras(e)
	{
		var expressao;//aceitar somente letra
		expressao = /[0-9]/;
		if(expressao.test(String.fromCharCode(e.keyCode)))
		{
			return false;
		}
		else
		{
			return true;
		}
	}