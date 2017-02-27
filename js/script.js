var db ='http:192.168.1.172:3000/product/'


function tableclean(){ //função que limpa a tabela
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

function limparCamposForm(){  //função que limpa o madal
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

function ajax(tipo, url, msg, dados){//requisição ajax, conforme dados recebidos

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
	
}

function avisos(msg){ //avisos de intereção com o usuário
	$('#aviso').fadeIn('fast', function(){
	});
	$( "#textoaviso" ).html("<h1>"+msg+"</h1>");
	$('#aviso').fadeOut(1500, function(){
	});

}

function maskmoney(){//máscara para campo de valor
	   $("input#valor").maskMoney({showSymbol:true, symbol:"R$", decimal:".", thousands:","});
}


function idmodaledit(bot){//coloca o id do produto como data-item do modal editar
	$("#editar").data('item', bot);
}

function idmodaldel(btn){//coloca o id do produto como data-item do modal detetar
	$("#confirmaapagar").data('item', btn);

}

function apagar(btn){ 
	var id = $(btn).data("item");
	msg=("Produto excluido com sucesso!");
	ajax("DELETE", db+id,msg);	
}

function mudamodaladit(){//funções de mudança de título e botões 
	$( "#modaltitulo" ).html( "Adicionar produto" );
	$("#adicionar").show();
	$("#editar").hide();
}

function mudamodaledit(){
	$( "#modaltitulo" ).html( "Editar produto" );
	$("#editar").show();
	$("#adicionar").hide();
}

function salvarnovosdados(metodo, btn){ //salva novos dados e envia para requisição

	var codigo = $(btn).data("item");
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

function procuraigual(){ //função que procura produto igual
	var teste

	$.get(db, function(data) {
		for(var i=0; i<data.length; i++){
			if($("#nome").val().toLowerCase()==data[i].nome.toLowerCase()) {
				exibiraviso("2");
				teste= 0;
			}
		}
	if (teste != 0) {
		salvarnovosdados("POST");
	}
});
}	

function confereform(tipo,btn){ //função que valida formulário;

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


function exibiraviso(aten){//alertas para incosistencias 

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


function coletardadostabela(btn){ //coleta dados digitados pelo usuário
	
	var id = $(btn).parents('tr').data("id");
	var NOME= $(btn).parents('tr').data("nome");
	var VALOR = $(btn).parents('tr').data("valor");
 	var STATUS = $(btn).parents('tr').data("status");
 	var ESTOQUE = $(btn).parents('tr').data("estoque");
 	preencher(NOME,VALOR,STATUS,ESTOQUE)
}

function preencher(nome,valor,status,estoque){ //preenche modal na função editar

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

	$('#estoque').keyup(function () { //substitui tudo que não é numero por espaço
	    if (!this.value.match(/[0-9]/)) {
	        this.value = this.value.replace(/[^0-9]/g, '');
	    }
	});
	$("#nome").keyup(function(){
		var regex = /[^a-zA-Z- çãõáéíóúàèÌòùâêîôûäëïüöÃÕÁÉÍÓÚÀÈÌÒÙÄÜÏÖËÂÊÎÔÛ]/g; 
		if($(this).val().match(regex)){
			$(this).val( $(this).val().replace(regex,'') );
		}
	});
}

$(document).ready(function(){
	actions();
	tabelatoda();
	maskmoney();
})
