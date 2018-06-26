

// Put your custom code here

// online
var apipath='http://w02.yeapps.com/marico18/syncmobile_20180603/';
var apipath_image = 'http://w02.yeapps.com/marico18/';


// local
//var apipath='http://127.0.0.1:8000/marico18/syncmobile/';
//var apipath_image = 'http://127.0.0.1:8000/marico18/';


localStorage.step_flag=0; 
var step_flag=0; //1 fd , 2 qpds, 3 gift

var versionFlag=0;
var noticeFlag=0;

var temp_image_div='';

localStorage.preLatitude=0;
localStorage.preLongitude=0;

//-------GET GEO LOCATION Start----------------------------
function getlocationand_askhelp() { //location
    $("#lat").val(0);
	$("#long").val(0);	
	var options = { enableHighAccuracy: true,timeout:5000};
	navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
	$("#location_button").hide();
	$("#submit_data").html("Confirming Location. Please Wait...");
	
	//localStorage.placeLatLongCount=parseInt(localStorage.placeLatLongCount)+1
	//alert (parseInt(localStorage.placeLatLongCount))
}

	 
// onSuccess Geolocation
function onSuccess(position) {	
	localStorage.latitude=position.coords.latitude;
	localStorage.longitude=position.coords.longitude;
	
	if (localStorage.preLatitude==0 && localStorage.preLongitude==0){
		localStorage.preLatitude=position.coords.latitude;
		localStorage.preLongitude=position.coords.longitude;		
	}	
		
	//alert (localStorage.latitude);
	$("#lat").val(localStorage.latitude);
	$("#long").val(localStorage.longitude);
	$("#submit_data").html("Location Confirmed");
	localStorage.latlongSubmit=1;
	buttonCheck();
	
}
	
function onError(error) {
	
	//$("#submit_data").html('Please Ensure  Your GPS is On');
	$("#sub_button").hide();
	$("#location_button").hide();
	
	if (localStorage.preLatitude==0 && localStorage.preLongitude==0){
		$("#lat").val(localStorage.preLatitude);
		$("#long").val(localStorage.preLongitude);
		localStorage.latlongSubmit=1;
		buttonCheck();
	}else{
		localStorage.latlongSubmit=0;	
	}
	
}
//-------GET GEO LOCATION End----------------------------
//=============get time start===================
function get_date() {
	var currentdate = new Date(); 
	var datetime = currentdate.getFullYear() + "-" 
			+ (currentdate.getMonth()+1)  + "-"  
			+ currentdate.getDate() + " "
            + currentdate.getHours() + ":"  
            + currentdate.getMinutes() + ":" 
            + currentdate.getSeconds();
	return datetime;
}
//=============get tieme end=============

//============================================
//--------------------------------------------- Exit Application
function exit() {	
	navigator.app.exitApp();

}

function syncPage(){	
	$(".errMsg").html('');
	$.mobile.navigate("#login");
	}
	
function menu_page(){	
	$(".errMsg").html('');
	$.mobile.navigate("#menuPage");
	}	

function backClick(){
	$(".errMsg").text("");
}

//--- version
function chkVersion(){
	
	var presentVDate="2017/12/30"; //  2016/06/14
	
	//alert(apipath+'sync_app_version?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode);
	
	$.ajax({
		 type: 'POST',
		 url: apipath+'sync_app_version?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode,
		 success: function(result) {
			 	if (result!=""){													
					var prevDate=result.slice(0,10).replace("-","/").replace("-","/");																
					
					var chkVersionDate=new Date(prevDate).setHours(0,0,0,0)!=new Date(presentVDate).setHours(0,0,0,0)					
					if(chkVersionDate==true){								
						$("#versionDiv").show();
						setInterval(function (){$("#versionDiv").fadeOut(2000).fadeIn(1000)},1000);																		
					}else{						
						$("#versionDiv").hide();
						chkNotice()			
					}
					
				}else{
					$(".errMsg").html("");
					$("#versionDiv").hide();
					chkNotice()					
				}		
			}
	});	
}


// notice
function chkNotice(m){	
	var chkN=m;
		
	var sync_date_get=get_date()
	var sync_y=sync_date_get.split('-')[0];
	var sync_m=sync_date_get.split('-')[1];
	if (sync_m.length==1){sync_m='0'+sync_m}
	var sync_d=sync_date_get.split('-')[2].split(' ')[0];
	if (sync_d.length==1){sync_d='0'+sync_d}
	var sync_cur_date=sync_y +'/'+ sync_m +'/'+sync_d;	
					
	//alert(apipath+'sync_notice?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode);
	
	$.ajax({
		 type: 'POST',
		 url: apipath+'sync_notice?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode,
		 success: function(result) {
				if (result!=""){
					var notice_array=result.split("<rd>");					
					
					noticeListStr='';
					var s_notice_lst_date="";
					for (var i=0; i < notice_array.length; i++){
						s_notice=notice_array[i].split("<fd>");
						s_notice_date=notice_array[0].split("<fd>");
						s_notice_lst_date=s_notice_date[0].replace("-","/").replace("-","/");				
						noticeListStr+='<ul data-role="listview" data-inset="true" data-mini="true" ><li style="height:8px; text-align:right; background-color:#EEE;">'+s_notice[0]+'</li><li id="noticeToday_'+i+'" class="ui-field-contain">'+s_notice[1]+'</li></ul>';			  	
					}
										
					$('#notice_list_show').html(noticeListStr).trigger('create');
					
					if(chkN==1){							
						$.mobile.navigate("#noticePage");	
					}else{				
						var chkNoticeDate=new Date(s_notice_lst_date).setHours(0,0,0,0)==new Date(sync_cur_date).setHours(0,0,0,0)						
						
						if(chkNoticeDate==true){
							$.mobile.navigate("#noticePage");
							$("#noticeToday_0").css('background','#FFFFE9');						
						}else{
							$.mobile.navigate("#menuPage");												
						}
					}
				}else{
					$(".errMsg").html("");
					
				}		
			}
	});					
	
}




//================ salfie

function attandance(){
	$(".errMsg").html("");
	$("input:radio").removeAttr('checked');
	
	var d = new Date();
	var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	
	var today = new Date();
	var dd = today.getDate();
	var allM = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	var mm=allM[today.getMonth()];
	var yyyy=today.getFullYear();
	
	document.getElementById("currentDate").innerHTML =  dd +' '+ mm +' '+yyyy +' | '+ days[d.getDay()];	
	
	$.mobile.navigate("#salfiePage");
	}


function salfie_next_page(){
		$(".errMsg").html("");				
		var attendance=$("input[name='attendance']:checked").val();				
		if (attendance=="" || attendance==undefined){
			$(".errMsg").html("Check Attendance Type");		
		}else{		
			var salfie_image_name=$("#salfie_image_name_hidden").val();
			var salfie_image_path=$("#salfie_image_div_hidden").val();					
			
			if (salfie_image_path.length < 10){				
					var url = "#salfiePage";
					$.mobile.navigate(url);
			}else{															
				
				alert(apipath+'syncAttendanceData?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&salfie_data='+salfie_image_name+'&attendance='+encodeURIComponent(attendance));
				
				$.ajax({
				type: 'POST',
				url: apipath+'syncAttendanceData?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&salfie_data='+salfie_image_name+'&attendance='+encodeURIComponent(attendance),
				 success: function(result) {	
						
						if (result==''){
							alert ('Sorry Network not available');
						}else if(result=='Success'){
							localStorage.attendanceType=attendance;
							
							if (localStorage.attendanceType=="Day Start"){
								localStorage.attendanceFlag=1;								
							}else{
								localStorage.attendanceFlag=0;
								localStorage.attendanceType="";
							}
							alert(localStorage.attendanceFlag);														
							upload_salfie()
							
							/*if (localStorage.attendanceFlag==1){ // Faisal
								$.mobile.navigate("#routePage");	
							}*/
									
						}else if(result=='Already Exists'){
							//$(".errMsg").html(result); // Faisal
							$.mobile.navigate("#menuPage");// Faisal
							//$.mobile.navigate("#routePage");												
						}else{
							$(".errMsg").html(result);						
						}
				 	}
				 })				
			}
		}
}



function salfie_ready_data() { 
	var salfie_data="";
	var image_name=$("#salfie_image_name_hidden").val();
	var salfie_image_path=$("#salfie_image_div_hidden").val();
	salfie_data=salfie_data+image_name+'fdfd'+salfie_image_path+'rdrd';
	localStorage.salfie_data_ready=salfie_data
	
	salfie_page_set();
}
function salfie_page_set() { 
	var salfie_data =  localStorage.salfie_data_ready.replace("rdrd","");
	var salfie_array =  salfie_data.split('fdfd');
	var image_name = salfie_array[0];
	var salfie_image_path = salfie_array[1];
	//alert (image_name)
	$("#salfie_image_name_hidden").val(image_name);
	$("#salfie_image_div_hidden").val(salfie_image_path);
	
	//alert (image_name)
	var image = document.getElementById('salfie_image_div');
    image.src = salfie_image_path;
	
}

//================= salfie end


function outlet_next_page(){
	
	var shop_image_name=$("#shop_image_name_hidden").val();
	var shop_image_path=$("#shop_image_div_hidden").val();
	
	if (shop_image_name !=''){
	if (shop_image_path.length < 10){
			var url = "#cancelPage";
			$.mobile.navigate(url);
	}
	else{
		shop_ready_data();
		
		   if ((localStorage.routeException_found == '1') && ((localStorage.outletException=='undefined') || (localStorage.outletException==undefined))){
				
				var url = "#outletexceptionPage";
				$.mobile.navigate(url);
				
				$(url).trigger('create');
				
			}
			else{
				
					if (localStorage.qpdsSkip==0){
						var url = "#qpdsPage";
						$.mobile.navigate(url);
						$('#shop_show').find('input, textarea, button, select').attr('disabled','disabled');
					 	$('#shop_show').addClass('disabledAnchor');	
						localStorage.shop_next_flag=1;
						
					}
					$(".errMsg").text("");					
					var url = "#qpdsPage";
					$.mobile.navigate(url);					
					
					$(url).trigger('create');
			}
	}
	}else{
		$(".errMsg").text("Require Image");
	}
	//getlocationand_askhelp();
}



function shop_ready_data() { 
	var shop_data="";
	var image_name=$("#shop_image_name_hidden").val();
	var shop_image_path=$("#shop_image_div_hidden").val();
	shop_data=shop_data+image_name+'fdfd'+shop_image_path+'rdrd';
	localStorage.shop_data_ready=shop_data
		
	shop_page_set();
}

function shop_page_set() { 
	var shop_data =  localStorage.shop_data_ready.replace("rdrd","");
	var shop_array =  shop_data.split('fdfd');
	var image_name = shop_array[0];
	var shop_image_path = shop_array[1];
	//alert (image_name)
	$("#shop_image_name_hidden").val(image_name);
	$("#shop_image_div_hidden").val(shop_image_path);
	
	//alert (image_name)
	var image = document.getElementById('shop_image_div');
    image.src = shop_image_path;
	
}


//================ unpaid

function unpaid_next_page(){		
	var unpaid_image_name=$("#unpaid_image_name_hidden").val();
	var unpaid_image_path=$("#unpaid_image_div_hidden").val();
	
	
	if (unpaid_image_path.length < 10){
			var url = "#unpaidDisplayPage";
			$.mobile.navigate(url);
	}else{
		unpaid_ready_data();
		$(".errMsg").text("");
			
		var url = "#qpdsPage";
		$.mobile.navigate(url);
		
		$('#qpdsPage').trigger('create');
	}
	
	
}


function unpaid_ready_data() { 
	var unpaid_data="";
	var image_name=$("#unpaid_image_name_hidden").val();
	var unpaid_image_path=$("#unpaid_image_div_hidden").val();
	unpaid_data=unpaid_data+image_name+'fdfd'+unpaid_image_path+'rdrd';
	localStorage.unpaid_data_ready=unpaid_data	
	
	unpaid_page_set();
}

function unpaid_page_set() { 
	var unpaid_data =  localStorage.unpaid_data_ready.replace("rdrd","");
	var unpaid_array =  unpaid_data.split('fdfd');
	var image_name = unpaid_array[0];
	var unpaid_image_path = unpaid_array[1];
	//alert (image_name)
	$("#unpaid_image_name_hidden").val(image_name);
	$("#unpaid_image_div_hidden").val(unpaid_image_path);
	
	//alert (image_name)
	var image = document.getElementById('unpaid_image_div');
    image.src = unpaid_image_path;	
	
}

//================ posm

function add_posm(){	
	posm_name=$("#select_posm").val();
	posm_qty=$("#posm_qty").val();	
	
	
	if(posm_name==undefined || posm_name==""){		
		$(".errMsg").html("Requred Name");	
	}else if(posm_qty==undefined || posm_qty==""){
		$(".errMsg").html("Requred Qty");
	}else{	
		trStr='<tr><td width="60%" name="posm_name" style="padding:20px;">'+posm_name+'</td><td width="30%" style="padding:20px;" name="posm_qty">'+posm_qty+'</td><td width="10%"><button data-role="button" data-mini="true" onClick="$(this).parent().parent().remove();">X</button></td></tr>'		
		$("#tblPosm").append(trStr).trigger('create');
	}
	
}

function posm_next_page(){		
	
	var posm_image_name=$("#posm_image_name_hidden").val();
	var posm_image_path=$("#posm_image_div_hidden").val();

	if (posm_image_path.length < 10){
			var url = "#posmPage";
			$.mobile.navigate(url);
	}else{
		posm_ready_data();
		
		$(".errMsg").text("");			
		var url = "#competitorPage";
		$.mobile.navigate(url);
		
		$('#competitorPage').trigger('create');
	}
}


function posm_ready_data() { 
	var posm_data="";
	$("#tblPosm tr:gt(0)").each(function(index){
		 posm_name = $('[name="posm_name"]').eq(index).text();
		 posm_qty = $('[name="posm_qty"]').eq(index).text();		 
		 if (posm_data==""){
			posm_data=posm_name+'<fdfd>'+posm_qty;			
		}else{
			posm_data+='<rdrd>'+posm_name+'<fdfd>'+posm_qty;			
		}	 
	})
	
	var image_name=$("#posm_image_name_hidden").val();
	var posm_image_path=$("#posm_image_div_hidden").val();
	posm_data=posm_data+'<rdrdrd>'+image_name+'<rdrdrd>'+posm_image_path;
	localStorage.posm_data_ready=posm_data	
	
	posm_page_set();
}

function posm_page_set() { 
	//var posm_data =  localStorage.posm_data_ready.replace("rdrd","");
	var posm_array =  localStorage.posm_data_ready.split('<rdrdrd>');
	var image_name = posm_array[1];
	var posm_image_path = posm_array[2];	
	$("#posm_image_name_hidden").val(image_name);
	$("#posm_image_div_hidden").val(posm_image_path);
	
	//alert (image_name)
	var image = document.getElementById('posm_image_div');
    image.src = posm_image_path;	
	
}

//================ competitor

function add_comp_data(){
	
	competitor=$("#select_comp").val();
	competitor_q=$("#select_comp_q").val();
	competitor_a=$("#copmA").val();	
	
	if(competitor==undefined || competitor==""){		
		$(".errMsg").html("Requred Competitor");	
	}else if(competitor_q==undefined || competitor_q==""){
		$(".errMsg").html("Requred Question");
	}else if(competitor_a==undefined || competitor_a==""){
		$(".errMsg").html("Requred Answer maximum 100 character");
	}else{	
		trStr='<tr><td width="20%" name="competitor">'+competitor+'</td><td width="35%" name="competitorQ">'+competitor_q+'</td><td width="35%" name="competitorA">'+competitor_a+'</td><td width="10%"><button data-role="button" data-mini="true" onClick="$(this).parent().parent().remove();">X</button></td></tr>'
		
		$("#tblComp").append(trStr).trigger('create');
	}
	
}


function competitor_next_page(){		
	var competitor_image_name=$("#competitor_image_name_hidden").val();
	var competitor_image_path=$("#competitor_image_div_hidden").val();

	if (competitor_image_path.length < 10){
			var url = "#competitorPage";
			$.mobile.navigate(url);
	}else{
		competitor_ready_data();
		
				
		var url="#selfPositionPage";		
		$.mobile.navigate(url);
		
		$('#selfPositionPage').trigger('create');
	}	
}


function competitor_ready_data() { 
	var competitor_data="";
	
	$("#tblComp tr:gt(0)").each(function(index){		
		 comp_name = $('[name="competitor"]').eq(index).text();
		 comp_q = $('[name="competitorQ"]').eq(index).text();
		 comp_a = $('[name="competitorA"]').eq(index).text();
		 
		 
		 if (competitor_data==""){
			competitor_data=comp_name+'<fdfd>'+comp_q+'<fdfd>'+comp_a;			
		}else{
			competitor_data+='<rdrd>'+comp_name+'<fdfd>'+comp_q+'<fdfd>'+comp_a;			
		}	 
	})
	
	var image_name=$("#competitor_image_name_hidden").val();
	var competitor_image_path=$("#competitor_image_div_hidden").val();
	competitor_data=competitor_data+'<rdrdrd>'+image_name+'<rdrdrd>'+competitor_image_path+'<rdrdrd>';
	localStorage.competitor_data_ready=competitor_data;
		
	competitor_page_set();
}

function competitor_page_set() { 
	var competitor_data =  localStorage.competitor_data_ready.split("<rdrdrd>");	
	var image_name = competitor_data[1];
	var competitor_image_path = competitor_data[2];
	//alert (image_name)
	$("#competitor_image_name_hidden").val(image_name);
	$("#competitor_image_div_hidden").val(competitor_image_path);
	
	
	var image = document.getElementById('competitor_image_div');
    image.src = competitor_image_path;	
	
}
//============================

//================ self dafa

function self_position_next_page(){		
	var self_image_name=$("#self_image_name_hidden").val();
	var self_image_path=$("#self_image_div_hidden").val();	
	
	if (self_image_path.length < 10){
			var url = "#selfPositionPage";
			$.mobile.navigate(url);
	}else{
		self_ready_data();		
						
		var url = "#surveyPage";
		$.mobile.navigate(url);
		
		$('#surveyPage').trigger('create');
	}	
}


function self_ready_data() { 
	var self_data="";
	var image_name=$("#self_image_name_hidden").val();
	var self_image_path=$("#self_image_div_hidden").val();
	self_data=self_data+image_name+'fdfd'+self_image_path+'rdrd';
	localStorage.self_data_ready=self_data	
	
	self_page_set();
}

function self_page_set() { 
	var self_data =  localStorage.self_data_ready.replace("rdrd","");
	var self_array =  self_data.split('fdfd');
	var image_name = self_array[0];
	var self_image_path = self_array[1];
	//alert (image_name)
	$("#self_image_name_hidden").val(image_name);
	$("#self_image_div_hidden").val(self_image_path);
	
	//alert (image_name)
	var image = document.getElementById('self_image_div');
    image.src = self_image_path;	
	
}


//-----------------------
function survey_next_page(){
	
	if($("#survey_chk").find("input[type='checkbox']:checked").length==0){
		$("#surveyDataerror").text("Please check One");		
	}else{
		var survey_value="";
		for(i=1;i<=$("#survey_chk").find("input[type='checkbox']").length;i++){			
			var survey_ck=$("#survey_"+i).is(":checked")?1:0;			
			if (i==1){
				survey_value=survey_ck;
			}else{
				survey_value+=","+survey_ck;
			}			
		}		
		localStorage.surveyValue=survey_value;
		
		
		
		var url = "#submitPage";
		$.mobile.navigate(url);	
		$(url).trigger('create');
	}
	
}	



//=================after select an outlet
/*function clear_autho(){
	localStorage.cm_id='';
	localStorage.cm_pass='';
	localStorage.routeString='';
	localStorage.routeExStringShow='';
	localStorage.show_cancel=0;
	localStorage.m_new_string="";
	localStorage.selectedOutlet="";
	localStorage.outletExStringShow="";
	localStorage.outletException="";
	localStorage.outletChanne="";
	localStorage.outletNameID="";
	localStorage.attendanceType="";	
	
	localStorage.qpds_data_ready="";
	localStorage.gift_data_ready="";
	
	localStorage.mar_data_ready="";
	localStorage.synced="";
	
	
	localStorage.salfie_data_ready="";
	localStorage.unpaid_data_ready="";
	localStorage.paid_data_ready="";
	localStorage.posm_data_ready="";
	localStorage.competitor_data_ready="";
	localStorage.self_data_ready="";
	
	//distributon
	
								
	
	localStorage.attendanceFlag=0;
	localStorage.latlongSubmit=0;
	localStorage.dataSubmit=0;
	localStorage.qpdsdataSubmit=0;
	localStorage.shopdataSubmit=0;
	localStorage.placedataSubmit=0;
	localStorage.selfdataSubmit=0;
	
	var url = "#login";
	$.mobile.navigate(url);
	$(url).trigger('create');
	
}*/
function div_change(){
	localStorage.show_cancel=1
	$("#outletCancel").show();
	$("#outletString").hide();
	$("#menujpj").hide();
	
	$("#backjpj").hide();
	$("#link_route").hide();
	
	$(".outletNameShow").html(localStorage.outletNameID);
	
}


function cancel_outlet_next(){	
	$(".errMsg").html("");
	$("#next_option").hide();
	$("#cancel_option").show()
	$("#c_reason").html('');
	
	localStorage.cancel_page=0;
	
	$(".outletNameShow").empty()
	$(".outletNameShow").html(localStorage.outletNameID).trigger('create');
	
	$('#cancel_reason').empty();
	$('#cancel_reason').append(localStorage.cancel_combo_str).trigger('create');
	
	$("#tblPosm tr:gt(0)").empty();	
	$('#mar_cmbo_show').append(localStorage.marItemCmbo).trigger('create');
	
	$("#competitor").empty();			
	$("#competitor").append(localStorage.competitorCmbo).trigger('create');	
	
	$("#competitorQ").empty();			
	$("#competitorQ").append(localStorage.competitorQCmbo).trigger('create');	
		
	var url = "#cancelPage";
	$.mobile.navigate(url);
	location.reload();
	
}
function cancel_outlet_next_next(){	
	
	$(".errMsg").html("");
	$("#next_option").show();
	$("#cancel_option").hide();
		
	localStorage.cancel_page=1;
	
	$(".outletNameShow").empty()
	$(".outletNameShow").html(localStorage.outletNameID).trigger('create');
	
	$('#cancel_reason').empty();	
	$('#cancel_reason').append(localStorage.cancel_combo_str).trigger('create');
	
	$("#tblPosm tr:gt(0)").empty();	
	$('#mar_cmbo_show').append(localStorage.marItemCmbo).trigger('create');
	
	$("#competitor").empty();			
	$("#competitor").append(localStorage.competitorCmbo).trigger('create');	
	
	$("#competitorQ").empty();			
	$("#competitorQ").append(localStorage.competitorQCmbo).trigger('create');		
	
	var url = "#cancelPage";
	$.mobile.navigate(url);
	location.reload();
	
}


function cancel_outlet_Back(){
	var cancel_reason=$("#cancel_cause").val();
	var imageName=$("#shop_image_name_hidden").val();
	var imagePath=$("#shop_image_div_hidden").val();
	var latitude=$("#lat").val();
	var longitude=$("#long").val();
	//alert (latitude);
	
	//alert (cancel_reason)
	if (imageName==""){
		$("#c_reason").html('Require Image');
	}else if (cancel_reason==""){
		$("#c_reason").html('Please Select Reason');
	}else{
		if (cancel_reason=="Will try later"){
			cancel_outlet();
			var url = "#outletPage";
			$.mobile.navigate(url);
		}else{
			if (imagePath.length < 10){
				$("#c_reason").html('Please Take Picture');
				}else{
	//				//Submit to visit as cancel
					var outletID= (localStorage.outletNameID).split('|')[1]
	//				//alert (localStorage.selectedRoute);
				//$("#c_reason").html(apipath+'cancel_outlet?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&selectedRoute='+localStorage.selectedRoute+'&routeEx='+localStorage.routeException+'&outlet='+outletID+'&outletEx='+localStorage.outletException+'&cancel_reason='+cancel_reason+'&imageName='+imageName+'&imagePath='+imagePath+'&latitude='+latitude+'&longitude='+longitude);
					//alert(apipath+'cancel_outlet?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&selectedRoute='+localStorage.selectedRoute+'&routeEx='+localStorage.routeException+'&outlet='+outletID+'&outletEx='+localStorage.outletException+'&cancel_reason='+cancel_reason+'&imageName='+imageName+'&imagePath='+imagePath+'&latitude='+latitude+'&longitude='+longitude);
					$.ajax({
						 type: 'POST',
						 url: apipath+'cancel_outlet?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&selectedRoute='+localStorage.selectedRoute+'&routeEx='+localStorage.routeException+'&outlet='+outletID+'&outletEx='+localStorage.outletException+'&cancel_reason='+cancel_reason+'&imageName='+imageName+'&imagePath='+imagePath+'&latitude='+latitude+'&longitude='+longitude,
						 success: function(result) {
							 //alert (result)
								if (result==''){
									$("#loginButton").show();
									$("#login_image").hide();
									alert ('Sorry Network not available');
								}
								else{
											
									if (result=='FAILED'){										
										$(".errMsg").html('Please Try Again');
									}
									if (result=='SUCCESS') {
										
										cancel_outlet();
										var url = "#outletPage";
										$.mobile.navigate(url);
										//$('#shop_show').find('input, textarea, button, select').attr('disabled','disabled');
										
									}
							   }
							  },
						  error: function(result) {
							 // $("#error_login").html(apipath+'check_user?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode);
							  $(".errMsg").html('Network timeout. Please ensure you have good network signal and working Internet.');
							  $("#loginButton").show();
							  $("#login_image").hide();
							  var url = "#login";
							  $.mobile.navigate(url);	
							  
						  }
					  });//end ajax
					upload_shop();
					$("#shop_image_name_hidden").val("");
					$("#shop_image_div_hidden").val("");
			} // End else
	
		} //End else
	} //end else
	
}

function cancel_outlet(){
	localStorage.show_cancel=0;
	localStorage.outletNameID='';
	
	
	localStorage.selectedOutlet="";
	localStorage.selected_date="";
	localStorage.outletException="";
	localStorage.outletChannel="";

	localStorage.m_new_string="";
	localStorage.m_new="";
	localStorage.selectedOutlet="";
	//localStorage.outletExStringShow="";
	localStorage.outletException="";
	localStorage.outletChanne="";
	localStorage.outletNameID="";
	localStorage.mhskusTotal="";
	
	
	localStorage.qpdsSlabTotal="";
	
	
	localStorage.qpds_data_ready="";
	localStorage.gift_data_ready="";
	localStorage.mar_data_ready="";
	
	localStorage.shop_data_ready="";
	localStorage.place_data_ready="";
	
	localStorage.salfie_data_ready="";
	localStorage.unpaid_data_ready="";
	localStorage.paid_data_ready="";
	localStorage.posm_data_ready="";
	localStorage.competitor_data_ready="";
	localStorage.self_data_ready="";
	
	localStorage.shop_next_flag=0;	
	localStorage.qpds_next_flag=0;	
	localStorage.place_next_flag=0;
	
		
	//localStorage.latitude=0;
	//localStorage.longitude=0;
	
	
	//localStorage.latlongSubmit=0;
	localStorage.dataSubmit=0;
	
	localStorage.salfiedataSubmit=0;
	localStorage.shopdataSubmit=0;
	localStorage.unpaiddataSubmit=0;
	localStorage.qpdsdataSubmit=0;
	
	localStorage.fddataSubmit=0;
	localStorage.npddataSubmit=0;
	localStorage.giftdataSubmit=0;
	localStorage.placedataSubmit=0;
	localStorage.posmdataSubmit=0;
	localStorage.compdataSubmit=0;
	localStorage.selfdataSubmit=0;
	
	localStorage.displayDataSubmit=0;
	localStorage.posmCompDataSubmit=0;
	//localStorage.placeLatLongCount=0;
	
	
	localStorage.outletException='undefined';
	$("#outletCancel").hide();
	$("#outletString").show();
	$("#menujpj").show();
	$("#backjpj").show();
	$("#link_route").show();
	
	$("#outletWait").show();
	$("#outletButton").hide();
	
	$(".outletNameShow").html(localStorage.outletNameID);
	
	$('#cancel_reason').empty();
	$('#cancel_reason').append(localStorage.cancel_combo_str).trigger('create');
	
	$("#tblPosm tr:gt(0)").empty();	
	$('#mar_cmbo_show').append(localStorage.marItemCmbo).trigger('create');
	
	$("#competitor").empty();			
	$("#competitor").append(localStorage.competitorCmbo).trigger('create');	
	
	$("#competitorQ").empty();			
	$("#competitorQ").append(localStorage.competitorQCmbo).trigger('create');		
	
	//location.reload();
}
//=============================================
//=========================Check user=====================
function check_user() { 
	$(".errMsg").html("");
	var cm_id=$("#cm_id").val();
	var cm_pass=$("#cm_pass").val();
		
	if (cm_id=="" || cm_id==undefined || cm_pass=="" || cm_pass==undefined){
		var url = "#login";      
		$.mobile.navigate(url);
	}else{
		
		$("#login_image").show();
		$("#loginButton").hide();
		localStorage.cid='MARICO';
		localStorage.cm_id=cm_id;
   		localStorage.cm_pass=cm_pass;
		localStorage.synced='NO'
		
	//	clear_autho();
   		
		//alert(apipath+'check_user?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode);
	//$("#error_login").html(apipath+'check_user?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode);	
   		$.ajax({
				 type: 'POST',
				 url: apipath+'check_user?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode,
				 success: function(result) {
					// alert (result)
						if (result==''){
							$("#loginButton").show();
							$("#login_image").hide();
							alert ('Sorry Network not available');
						}else{
							var resultArray = result.split('<SYNCDATA>');			
							if (resultArray[0]=='FAILED'){
								//$("#error_login").html('Failed');
								$("#loginButton").show();
								$("#login_image").hide();
								$(".errMsg").html('Unauthorized User');
							}
							if (resultArray[0]=='SUCCESS'){
								cancel_outlet();
								$("#loginButton").show();
								$("#login_image").hide();
								var sync_date_get=get_date();
								var sync_date_get=get_date();
								
								var sync_y=sync_date_get.split('-')[0];
								var sync_m=sync_date_get.split('-')[1];
								if (sync_m.length==1){sync_m='0'+sync_m}
								var sync_d=sync_date_get.split('-')[2].split(' ')[0];
								if (sync_d.length==1){sync_d='0'+sync_d}
								var sync_date=sync_y +'-'+ sync_m +'-'+sync_d;
								localStorage.sync_date=sync_date;
								
								localStorage.synced='YES';
								localStorage.synccode=resultArray[2];
								
								
								
								result_string=resultArray[1];
								localStorage.routeString_bak=result_string;
								
								var routeArray = result_string.split('</routeList>');									
								routeList = routeArray[0].replace("<routeList>","");
								
								routeException = routeArray[1];
								var routeExArray = routeException.split('</routeexList>');									
								routeExList = routeExArray[0].replace("<routeexList>","");
								
																
								//alert (routeExArray[1])
								var cancel_reason = routeExArray[1];
								var cancel_reasonArray = cancel_reason.split('</cancelList>');									
								var cancelList = cancel_reasonArray[0].replace("<cancelList>","");
								
								var place_str = cancel_reasonArray[1];
								var place_strArray = place_str.split('</placeList>');									
								var place_strList = place_strArray[0].replace("<placeList>","");
								
								
								//create cancel reason combo
								var cancelArray = cancelList.split('rdrd');	
								var cancel_combo_str='<select name="cancel_cause" id="cancel_cause" data-mini="true" >'
								cancel_combo_str=cancel_combo_str+'<option value=""></option>'
								cancel_combo_str=cancel_combo_str+'<option value="Will try later">Will try later</option>'
								for (var i=0; i < cancelArray.length; i++){				
									cancel_combo_str=cancel_combo_str +'<option value="'+cancelArray[i].split('fdfd')[0]+'">'+cancelArray[i].split('fdfd')[1]+'</option>'			  	
								}
								cancel_combo_str=cancel_combo_str+'</select>'
								
								
								localStorage.cancel_combo_str=cancel_combo_str
								
								$('#cancel_reason').empty();
								$('#cancel_reason').append(localStorage.cancel_combo_str).trigger('create');
																
								//create place  combo
														
								
						  //==========Create route list
								var routeSingleArray = routeList.split('rdrd');	
								var routeSingleTtotal = routeSingleArray.length;
								var routeStringShow=''
								
								var d=new Date();
								var weekday=new Array(7);
								weekday[0]="Sunday";
								weekday[1]="Monday";
								weekday[2]="Tuesday";
								weekday[3]="Wednesday";
								weekday[4]="Thursday";
								weekday[5]="Friday";
								weekday[6]="Saturday";
								
								var today_get = weekday[d.getDay()];
								
								//alert (today_get);
								var alowSl=''
								for (var rs=0; rs < routeSingleTtotal-1; rs++){
									routeSArray = routeSingleArray[rs].split('fdfd');
									routeSID=routeSArray[0];
										
									
									routeSArray = routeSID.split('|');
									var r_sday=routeSArray[2];
									var r_sdaySl=routeSArray[3];
									
									//alert (r_sday);
									
									if (today_get=='Saturday'){
										r_sdaySl=1;
									}
									if (today_get=='Sunday'){
										r_sdaySl=2;
									}
									if (today_get=='Monday'){
										r_sdaySl=3;
									}
									if (today_get=='Tuesday'){
										r_sdaySl=4;
									}
									if (today_get=='Wednesday'){
										r_sdaySl=5;
									}
									if (today_get=='Thursday'){
										r_sdaySl=6;
									}
									if (today_get=='Friday'){
										r_sdaySl=7;
									}
									//alert (r_sdaySl);
									if (r_sday==today_get){	
											if (r_sdaySl==1){
												alowSl=	'7,6,5,1'
											}
											if (r_sdaySl==2){
												alowSl=	'1,7,6,2'
											}
											if (r_sdaySl==3){
												alowSl=	'1,2,7,3'
											}
											if (r_sdaySl==4){
												alowSl=	'3,2,1,4'
											}
											if (r_sdaySl==5){
												alowSl=	'4,3,2,5'
											}
											if (r_sdaySl==6){
												alowSl=	'5,4,3,6'
											}
											if (r_sdaySl==7){
												alowSl=	'6,5,4,7'
											}
											
									}
									
								}
								//alert (alowSl);
								
                
								for (var r=0; r < routeSingleTtotal-1; r++){
									routeArray = routeSingleArray[r].split('fdfd');
									routeID=routeArray[0];
									routeName=routeArray[1];	
									//alert (routeID);
									r_day = routeID.split('|')[2];
									//alert (routeSingleArray[r])
									//alert (r_sday+"         "+today_get)
									if (r_day==today_get){																			
									  routeStringShow=routeStringShow+'<label style="background:#81C0C0"><input type="radio" name="RadioRoute"  value="'+routeID+'" id="RadioGroup1_0"> '+routeName+'</label>'
									  //alert (alowSl)
									}
									else{
										//alert (routeID);
										//alert (r_day);
										if (r_day=='Saturday'){
											r_sdaySl='1';
										}
										if (r_day=='Sunday'){
											r_sdaySl='2';
										}
										if (r_day=='Monday'){
											r_sdaySl='3';
										}
										if (r_day=='Tuesday'){
											r_sdaySl='4';
										}
										if (r_day=='Wednesday'){
											r_sdaySl='5';
										}
										if (r_day=='Thursday'){
											r_sdaySl='6';
										}
										if (r_day=='Friday'){
											r_sdaySl='7';
										}
//									 alert (alowSl);
//									 alert (r_sdaySl);
//									 alert (alowSl.indexOf(r_sdaySl));
									 
										 if (alowSl.indexOf(r_sdaySl) != -1){
											 routeStringShow=routeStringShow+'<label ><input type="radio"  name="RadioRoute"  value="'+routeID+'" id="RadioGroup1_0"> '+routeName+'</label>'
										 }
										else{
											routeStringShow=routeStringShow+'<label style="background:#A6CEBB" ><input type="radio"  name="RadioRoute"  value="'+routeID+'" id="RadioGroup1_0"> '+routeName+'</label>'
										 }
									 
									}
									
								}
								localStorage.routeString=routeStringShow
								//alert(localStorage.routeString);
								$("#routeString").html(localStorage.routeString);
							
							//=======end route list====================
							//==========Create route exception list
								var routeExStringShow=''
								var routeExSingleArray = routeExList.split('rdrd');	
								var routeExSingleTtotal = routeExSingleArray.length;
								var routeExStringShow=''
								for (var re=0; re < routeExSingleTtotal-1; re++){
									routeExArray = routeExSingleArray[re].split('fdfd');
									routeExID=routeExArray[0];
									routeExName=routeExArray[1];
									routeExStringShow=routeExStringShow+'<label><input type="radio" name="RadioRouteEx"    value="'+routeExName+'" > '+routeExName+'</label>'
								}
								localStorage.routeExStringShow=routeExStringShow
								$("#routeExString").html(localStorage.routeExStringShow);
							
							//=======end route exception list====================								
								
							}
							if ((resultArray[0]=='SUCCESS') && (localStorage.route==undefined)){
								
								var url = "#menuPage";// Faisal
								//var url = "#routePage";
								$.mobile.navigate(url);
								
								$('#routePage').trigger('create');
							}
							
							if ((resultArray[0]=='SUCCESS') && (localStorage.route!=undefined)){
								var url = "#menuPage";
								$.mobile.navigate(url);
								
							}
														
						}
				      },
				  error: function(result) {
					 // $("#error_login").html(apipath+'check_user?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode);
					  $(".errMsg").html('Network timeout. Please ensure you have good network signal and working Internet.');
					  $("#loginButton").show();
					  $("#login_image").hide();
					  var url = "#login";
					  $.mobile.navigate(url);	
					  
				  }
			  });//end ajax
		  }//end else	
	}//function
//=========================set route for new date==============






//=========================Check user=====================
function check_route() {		
		//alert('chk- route');
		$(".errMsg").html('');
		
		result_string=localStorage.routeString_bak;
		
		var routeArray = result_string.split('</routeList>');									
		routeList = routeArray[0].replace("<routeList>","");
							
  //==========Create route list
		var routeSingleArray = routeList.split('rdrd');	
		var routeSingleTtotal = routeSingleArray.length;
		var routeStringShow=''
		
		var d=new Date();
		var weekday=new Array(7);
		weekday[0]="Sunday";
		weekday[1]="Monday";
		weekday[2]="Tuesday";
		weekday[3]="Wednesday";
		weekday[4]="Thursday";
		weekday[5]="Friday";
		weekday[6]="Saturday";
								
		var today_get = weekday[d.getDay()];
								
		//alert (today_get);
		var alowSl=''
		for (var rs=0; rs < routeSingleTtotal-1; rs++){
			routeSArray = routeSingleArray[rs].split('fdfd');
			routeSID=routeSArray[0];
				
			
			routeSArray = routeSID.split('|');
			var r_sday=routeSArray[2];
			var r_sdaySl=routeSArray[3];
			
			//alert (r_sday);
			
			if (today_get=='Saturday'){
				r_sdaySl=1;
			}
			if (today_get=='Sunday'){
				r_sdaySl=2;
			}
			if (today_get=='Monday'){
				r_sdaySl=3;
			}
			if (today_get=='Tuesday'){
				r_sdaySl=4;
			}
			if (today_get=='Wednesday'){
				r_sdaySl=5;
			}
			if (today_get=='Thursday'){
				r_sdaySl=6;
			}
			if (today_get=='Friday'){
				r_sdaySl=7;
			}
			//alert (r_sdaySl);
			if (r_sday==today_get){	
					if (r_sdaySl==1){
						alowSl=	'7,6,5,1'
					}
					if (r_sdaySl==2){
						alowSl=	'1,7,6,2'
					}
					if (r_sdaySl==3){
						alowSl=	'1,2,7,3'
					}
					if (r_sdaySl==4){
						alowSl=	'3,2,1,4'
					}
					if (r_sdaySl==5){
						alowSl=	'4,3,2,5'
					}
					if (r_sdaySl==6){
						alowSl=	'5,4,3,6'
					}
					if (r_sdaySl==7){
						alowSl=	'6,5,4,7'
					}
					
			}
			
		}
		//alert (alowSl);
		

		for (var r=0; r < routeSingleTtotal-1; r++){
			routeArray = routeSingleArray[r].split('fdfd');
			routeID=routeArray[0];
			routeName=routeArray[1];	
			
			r_day = routeID.split('|')[2];
			
			if (r_day==today_get){																			
			  routeStringShow=routeStringShow+'<label style="background:#81C0C0"><input type="radio" name="RadioRoute"  value="'+routeID+'" id="RadioGroup1_0"> '+routeName+'</label>'
			  //alert (alowSl)
			}else{				
				if (r_day=='Saturday'){
					r_sdaySl='1';
				}
				if (r_day=='Sunday'){
					r_sdaySl='2';
				}
				if (r_day=='Monday'){
					r_sdaySl='3';
				}
				if (r_day=='Tuesday'){
					r_sdaySl='4';
				}
				if (r_day=='Wednesday'){
					r_sdaySl='5';
				}
				if (r_day=='Thursday'){
					r_sdaySl='6';
				}
				if (r_day=='Friday'){
					r_sdaySl='7';
				}
			 //alert (alowSl);
//									 alert (r_sdaySl);
//									 alert (alowSl.indexOf(r_sdaySl));
			 
				 if (alowSl.indexOf(r_sdaySl) != -1){
					 routeStringShow=routeStringShow+'<label ><input type="radio"  name="RadioRoute"  value="'+routeID+'" id="RadioGroup1_0"> '+routeName+'</label>'
				 }else{
					routeStringShow=routeStringShow+'<label style="background:#A6CEBB" ><input  type="radio"  name="RadioRoute"  value="'+routeID+'" id="RadioGroup1_0"> '+routeName+'</label>'
				 }
					 
			}
				
		}
		localStorage.routeString=routeStringShow
		
		$("#routeString").html(localStorage.routeString);
	
	//=======end route list====================
						
								
		var url = "#routePage";
		$.mobile.navigate(url);	
		$(url).trigger('create');
	}//function


//==========================set route for new dateend=============

//=====================Check user end========================

//=====================Route Exception start=====================
function selectRouteException() { 
	$(".errMsg").html("");
	var selected_route_exception=($("input:radio[name='RadioRouteEx']:checked").val())
   // alert (selected_route_exception);
	if(selected_route_exception!=undefined){
		localStorage.routeException=selected_route_exception;
		var url = "#menuPage";
		$.mobile.navigate(url);	
	}
}
//=====================Route Exception end=====================
//=====================outlet start=====================
function marketPJP() { 
	$(".errMsg").html("");
	var selected_route_exception=($("input:radio[name='RadioRouteEx']:checked").val())
	var selected_route=($("input:radio[name='RadioRoute']:checked").val())
	
	if(selected_route==undefined){		
		$(".errMsg").html("Required Route");				
	}else{	
	
		$("#routeS_image").show();
		$("#RSButton").hide();
		
		
		var d=new Date();
		var weekday=new Array(7);
		weekday[0]="Sunday";
		weekday[1]="Monday";
		weekday[2]="Tuesday";
		weekday[3]="Wednesday";
		weekday[4]="Thursday";
		weekday[5]="Friday";
		weekday[6]="Saturday";
		
		var today_get = weekday[d.getDay()];
		
		
		var sync_date_get=get_date();
		//var sync_date=sync_date_get.substring(0,10);
		var sync_y=sync_date_get.split('-')[0];
		var sync_m=sync_date_get.split('-')[1];
		if (sync_m.length==1){sync_m='0'+sync_m}
		var sync_d=sync_date_get.split('-')[2].split(' ')[0];
		if (sync_d.length==1){sync_d='0'+sync_d}
		var sync_date=sync_y +'-'+ sync_m +'-'+sync_d;
		//sync_date.substring(1,10)
		//alert (sync_date);
		localStorage.sync_date=sync_date;
		
		
		var selected_routeArray = selected_route.split('|');	
		var selected_routeID=selected_routeArray[0];
		var selected_routeName=selected_routeArray[1];
		var selected_routeDay=selected_routeArray[2];
		
		
		localStorage.routeIDName=selected_routeName+" | "+selected_routeID
		if (selected_routeDay==today_get){
			localStorage.selectedRoute=selected_routeID;
			localStorage.routeException_found='0';			
		}
		else {
			localStorage.selectedRoute=selected_routeID;
			localStorage.routeException_found='1';			
		}
		
				
		if(localStorage.selectedRoute!=undefined){
			//$("#dataerror").html(apipath+'sync_route?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&route='+localStorage.selectedRoute);
		//======================================	
			//alert(apipath+'sync_route?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&route='+localStorage.selectedRoute);
			
			localStorage.routeException='';
			$.ajax({
					 type: 'POST',
					 url: apipath+'sync_route?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&route='+localStorage.selectedRoute,
					 success: function(result) {
							
							//alert(result);
							
							if (result==''){
								alert ('Sorry Network not available');
							}
							else{
								var resultArray = result.split('<SYNCDATA>');			
								if (resultArray[0]=='FAILED'){
									$(".errMsg").html('Unauthorized User');
									
								}
								if (resultArray[0]=='SUCCESS'){
									result_string=resultArray[1];
									if (result_string=='N'){
										outletStringShow_n='<label style="color:#800000; font-size:18px" ><table width="100%" border="0"> <tr> <td >Schedule Not Available </td>	</tr></table></label>'
										$("#dataerror").html(outletStringShow_n);
										$("#routeS_image").hide();
										$("#RSButton").show();
									}
									else{
											var outletArray = result_string.split('</outletList>');											
											var outletSArray = result_string.split('<outletexList>');											
											
																																	
											outletList = outletSArray[0].replace("<outletList>","");											
											var outletAllArray = outletSArray[1].split('</outletexList>');	
																			
											outletExList = outletAllArray[0];
											allOutletString = outletAllArray[1];
											
											
											
											localStorage.allOutletString=allOutletString;
											
											//alert(localStorage.allOutletString);
											//	============Create exception list============	
																	
											var outletExStringShow=''
											var outletExSingleArray = outletExList.split('rdrd');	
											var outletExSingleTtotal = outletExSingleArray.length;
											var outletExStringShow=''
											for (var oe=0; oe < outletExSingleTtotal-1; oe++){
												outletExArray = outletExSingleArray[oe].split('fdfd');
												outletExID=outletExArray[0];
												outletExName=outletExArray[1];
												outletExStringShow=outletExStringShow+'<label><input type="radio" name="RadioOutletEx"    value="'+outletExName+'" > '+outletExName+'</label>'
											}
											localStorage.outletExStringShow=outletExStringShow;
											$("#outletExString").html(localStorage.outletExStringShow);
											
											//alert (localStorage.outletExStringShow);
											
											
											//==========Create outlet list
											var outletSingleArray = outletList.split('rdrd');	
											var outletSingleTtotal = outletSingleArray.length;
											var outletStringShow=''
											
											outletStringShow=outletStringShow+'<table width="100%" border="0" cellpadding="0" cellspacing="0"><tr style="color:#006A6A; font-size:18px;"><td>'+localStorage.routeIDName+'</td></tr></table>'
											
											//alert (outletSingleTtotal);
											for (var o=0; o < outletSingleTtotal-1; o++){
												outletArray = outletSingleArray[o].split('fdfd');
												outletID=outletArray[0];
												outletName=outletArray[1];
												total_visit=outletArray[2];
												total_visit_done=outletArray[3];
												outlet_c=outletArray[4];
												depot_id=outletArray[5];												
												channel=outletArray[6];
												schedule_date=outletArray[7];
												
												outletColor="";
												
												outletStringShow=outletStringShow+'<label ><table width="100%" border="0"> <tr> <td width="5%">'+
																'<input type="radio" name="RadioOutlet" value="'+outletID+'rdrd'+schedule_date+'"></td><td width="80%">'+outletName +' | '+ outletID +' | '+ channel +'</td><td width="15%">'+total_visit_done+'/'+total_visit+' </td>	<td>'+outletColor+'</td> </tr></table></label>'
											
												
											}
											
											
											// If schedule not available
											
											if (outletSingleArray.length==1){
												outletStringShow=outletStringShow+'<label style="color:#800000; font-size:18px" ><table width="100%" border="0"> <tr> <td >Schedule Not Available </td>	</tr></table></label>'
												
											}
											outletStringShow=outletStringShow+'<br/><br/> <a id="selectOButton" data-role="button" onClick="select_outlet();" >Next</a>'
											
											//outletStringShow=outletStringShow+'<div id="outletWait" style="display:none"><img height="40px" width="40px" src="loading.gif"></div>'
											
											localStorage.outletString=outletStringShow
											$("#outletString").html(localStorage.outletString);
											//alert(localStorage.outletString);
											
											$("#routeS_image").hide();
											$("#RSButton").show();
											
											if (selected_routeDay==today_get){
												localStorage.selectedRoute=selected_routeID;
												localStorage.routeException_found='0';
												
												$(".errMsg").html('');
												
												var url = "#outletPage";												
											   $.mobile.navigate(url);	
											}
											else {
												localStorage.selectedRoute=selected_routeID;
												localStorage.routeException_found='1';
												
												$(".errMsg").html('');
												var url = "#routeexceptionPage";
												$.mobile.navigate(url);	
												$('#routeexceptionPage').trigger('create');
											}
										
										//=======end outlet list====================								
										}
			
									}
									
							   }//end else
						  },
					  error: function(result) {
						  
						  $(".errMsg").html('Network timeout. Please ensure you have good network signal and working Internet.');
						  
						  $("#outletCancel").hide();
						  $("#routeS_image").hide();
						  $("#RSButton").show();
						 
						 //$("#dataerrorRoute").html('Network timeout. Please ensure you have good network signal and working Internet.');
						  var url = "#routePage";
						  $.mobile.navigate(url);
					  }
				  });//end ajax*/
			
		}
	}//else
}



function marketPJP_check() { 
	/*$(".errMsg").html("");
	var url = "#routePage";
	$.mobile.navigate(url);*/
	
	
	//alert(localStorage.attendanceFlag);
	if(localStorage.attendanceFlag==1){	
		//if(localStorage.selectedRoute!=undefined){		
			//if (localStorage.route==''){
				var url = "#routePage";
				$.mobile.navigate(url);	
			//}
			/*if (localStorage.route!=''){					
				var url = "#outletPage";
				$.mobile.navigate(url);
				$(url).trigger('create');				
			}*/
	
		//}
	}else{
		$(".errMsg").html("Required attendance");
	}
}




//=====================Outlet end===================
//=====================select Outlet start============

function select_outlet() { 
		$(".errMsg").html('');
		$("#posm_qty").val('');
		$("#copmA").val('');
		
		//localStorage.latlongSubmit=0;
		localStorage.dataSubmit=0;		
		localStorage.qpdsdataSubmit=0;		
		localStorage.shopdataSubmit=0;
		localStorage.placedataSubmit=0;
		localStorage.posmdataSubmit=0;
		localStorage.compdataSubmit=0;
		localStorage.selfdataSubmit=0;
		//localStorage.placeLatLongCount=0
				
		
		localStorage.m_new="";
		localStorage.submitted_outlet="";
		
		
		localStorage.qpdsSkip=0;
		
		//localStorage.latitude=0;
		//localStorage.longitude=0;
		
					
		var selected_outletID_get=($("input:radio[name='RadioOutlet']:checked").val())		
		var selected_outletID_list = selected_outletID_get.split('rdrd');
		var selected_outletID=selected_outletID_list[0];	
		var selected_date_get=selected_outletID_list[1];
		
		//localStorage.selected_outletID_get=selected_outletID_get;
		
		if ((selected_outletID!=undefined) && (selected_outletID!='undefined')){
			
		   	// ---------
			$("#outletExString").html(localStorage.outletExStringShow);
			localStorage.selectedOutlet=selected_outletID;			
			localStorage.selected_date_get=selected_date_get;

			selected_date=selected_date_get;
			localStorage.selected_date=selected_date.substr(0,10);
			
			//--------
			div_change();
			
			$(".errMsg").html('');
			$("#outletWait").show();
			
			// $("#selectOButton").hide();
			
			var all_outlet=localStorage.allOutletString;
			var outlet_s="<"+localStorage.selectedOutlet+">"
			var outlet_end="</"+localStorage.selectedOutlet+">"
			
			var selected_outletinfo_list = all_outlet.split(outlet_s);			
			var selected_outletinfo=selected_outletinfo_list[1];
			
			
			var selected_outletinfo_list_end = selected_outletinfo.split(outlet_end);			
			var selected_outletinfo_all=selected_outletinfo_list_end[0];
			
			
			if (selected_outletinfo.length > 20){			
				var selected_outletinfo_show_list =  selected_outletinfo.split('<mhskusList>');
				var outlet_show=selected_outletinfo_show_list[0]
				var outlet_show_list =  outlet_show.split(',');
				var channel=outlet_show_list[0];
				var outlet=outlet_show_list[2] +" | "+outlet_show_list[1]+" | "+channel
				
				
				
				var replace_str=outlet_show_list[0] + "," + outlet_show_list[1] + "," + outlet_show_list[2] 
				var selected_outletinfo_all_final=selected_outletinfo_all.replace(replace_str,"");
				
				localStorage.selected_outletinfo_all_final=selected_outletinfo_all_final;
				
				
				//alert (outlet);
				var outletStringShow='';
				outletStringShow=outletStringShow+'<table width="100%" border="0" cellpadding="0" cellspacing="0">'
									outletStringShow=outletStringShow+'<tr> <td colspan="3" style="color:#006A6A; font-size:18px;">'+outlet+'</td></tr> '
									outletStringShow=outletStringShow+'</table>'
				
				
				localStorage.outletinfoString=outletStringShow
				localStorage.outletChannel=channel
				localStorage.outletNameID=outlet
				
				
				$(".outletNameShow").html(localStorage.outletNameID);
				$("#outletInfo").html(localStorage.outletinfoString);
						  
				//alert (localStorage.outletinfoString);		
				
				syncOutlet();
				
				}//endif
				
			}//end if
			
	 else{
		  
		  localStorage.show_cancel=0;
		  
		  $("#selectOButton").show();
		  
		  //cancel_outlet();
		  $("#outletCancel").hide();
		  var url = "#outletPage";
		  $.mobile.navigate(url);	
		  $(url).trigger('create');
		  location.reload();
		  
	  }


}

//=====================Outlet Exception start=====================
function selectOutletException() { 
	var selected_outlet_exception=($("input:radio[name='RadioOutletEx']:checked").val())
	if(selected_outlet_exception==undefined){
		$(".errMsg").html("Required Outlet Exception");
	}else{
		localStorage.outletException=selected_outlet_exception;
		
		$(".errMsg").html(""); 
		
				
		if (localStorage.qpdsSkip==0){		
			var url = "#qpdsPage";
			$.mobile.navigate(url);		
		}else{			
			//var url = "#npdPage";
			var url = "#unpaidDisplayPage";
			$.mobile.navigate(url);
		}
		
	}
}
//=====================Outlet Exception end=====================


//=====================Select Outlet Start====================

function syncOutlet() { 
	result_string=localStorage.selected_outletinfo_all_final;
	
	if (result_string.length > 50){
			
			var mhskusArray = result_string.split('</mhskusList>');									
			mhskusList = mhskusArray[0].replace("<mhskusList>","");
			npd = mhskusArray[1];
			var npdArray = npd.split('</npdList>');									
			npdList = npdArray[0].replace("<npdList>","");
								
								
			fdisplay = npdArray[1];
			var fdisplayArray = fdisplay.split('</fdisplayList>');									
			fdisplayList = fdisplayArray[0].replace("<fdisplayList>","");
		
			qpds = fdisplayArray[1];
			var qpdsArray = qpds.split('</qpdsList>');									
			qpdsList = qpdsArray[0].replace("<qpdsList>","");
			
			gift = qpdsArray[1];
			var giftArray = gift.split('</giftList>');									
			giftList = giftArray[0].replace("<giftList>","");
			
			marchadizing = giftArray[1];
			var marchadizingArray = marchadizing.split('</marList>');									
			marchadizingList = marchadizingArray[0].replace("<marList>","");
			
			//=====marchandizing Item=======
			marchadizingItem = marchadizingArray[1];
			var marchadizingItemArray = marchadizingItem.split('</marItemList>');									
			marchadizingItemList = marchadizingItemArray[0].replace("<marItemList>","");
			
			
			//=====marchandizing Brand=======
			marchadizingBrand = marchadizingItemArray[1];
			var marchadizingBrandArray = marchadizingBrand.split('</marBrandList>');									
			marchadizingBrandList = marchadizingBrandArray[0].replace("<marBrandList>","");
			
			
			
			//=====competitor=======
			competitor = marchadizingBrandArray[1];			
			var competitorArray = competitor.split('</compItemList>');									
			cpmpetitorList = competitorArray[0].replace("<compItemList>","");
			//localStorage.cpmpetitorList=cpmpetitorList
			var comp_info = cpmpetitorList.split('rdrd');		
			for (var i=0; i < comp_info.length-1; i++){
				localStorage.competitorList=comp_info
				
			}
			
			
			//=====must have item string=======
			musthavesku = competitorArray[1];			
			var musthaveArray = musthavesku.split('</mustHaveList>');									
			mustHaveList = musthaveArray[0].replace("<mustHaveList>","");
			
			var must_have_sku_str = mustHaveList.split('rdrd');		
			for (var i=0; i < must_have_sku_str.length-1; i++){
				localStorage.musthaveSku_str=must_have_sku_str;
			}
			
			//alert(mustHaveList);
						
			//==========Create MHSKUS list
			//alert ('nadira');
			var mhskusSingleArray = mhskusList.split('rdrd');	
			var mhskusSingleTotal = mhskusSingleArray.length;
			//alert (mhskusList);
			var mhskusStringShow=''
			//alert (localStorage.routeIDName)
			mhskusStringShow=mhskusStringShow+'<table width="100%" border="0"><tr style="color:#0329C0"> <td colspan="2" style="color:#006A6A; font-size:18px;">'+localStorage.routeIDName+'<br>'+localStorage.outletNameID+'</td></tr><tr > </table></br>'
			mhskusStringShow=mhskusStringShow+'<table  width="100%" border="0" cellpadding="0" cellspacing="0">'
			mhskusStringShow=mhskusStringShow+'<tr bgcolor="#9FCED7"  ><td></td><td>Item</td><td> QTY</td><td ></td></tr><tr height="1px" bgcolor="#CCCCCC" ><td></td><td></td><td> </td><td ></td></tr>'
			
			//i=6;
//								alert (i.toString())
			localStorage.mhskusTotal=mhskusSingleTotal
			
			for (var i=0; i < mhskusSingleTotal-1; i++){
				mhskusArray = mhskusSingleArray[i].split('fdfd');
				itemID=mhskusArray[0];
				itemName=mhskusArray[1];
				minQty=mhskusArray[2];
				var i_text=i.toString()
				var ItemQtymskus='ItemQtymskus_'+i_text
				var Itemmskus='Itemmskus_'+i_text
				var minQtymskus='minQtymskus_'+i_text
				
				
				mhskusStringShow=mhskusStringShow+'<tr ><td>&nbsp;</td><td>'+itemName+
				'<input type="hidden" name="'+ Itemmskus +'" id="'+ Itemmskus +'" value="'+itemID+'" min="0">'+
				'<input type="hidden" name="'+ minQtymskus +'" id="'+ minQtymskus +'" value="'+minQty+'" min="0">'+
				'</td><td width="60"><input type="number" name="'+ItemQtymskus +'" id="'+ ItemQtymskus +'" value="" min="0"></td><td width="5px">&nbsp;</td></tr>'
				mhskusStringShow=mhskusStringShow+'<tr height="1px" bgcolor="#CCCCCC" ><td></td><td></td><td> </td><td ></td></tr>'
				
			}
			mhskusStringShow=mhskusStringShow+'</table>'
			
			localStorage.mhskusStringShow=mhskusStringShow
			$("#mhskus").html(localStorage.mhskusStringShow);
								
								
			//==========Create NPD list
			
			var npdSingleArray = npdList.split('rdrd');	
			var npdSingleTotal = npdSingleArray.length;
			
			//alert (mhskusList);
			var npdStringShow=''
			npdStringShow=npdStringShow+'<table width="100%" border="0"><tr style="color:#0329C0"> <td colspan="2" style="color:#006A6A; font-size:18px;">'+localStorage.routeIDName+'<br>'+localStorage.outletNameID+'</td></tr><tr > </table></br>'
			npdStringShow=npdStringShow+'<table  width="100%" border="0" cellpadding="0" cellspacing="0">'
			npdStringShow=npdStringShow+'<tr bgcolor="#9FCED7"  ><td></td><td>Item</td><td> QTY</td><td ></td></tr><tr height="1px" bgcolor="#CCCCCC" ><td></td><td></td><td> </td><td ></td></tr>'
			
			//i=6;
//								alert (i.toString())
			localStorage.npdTotal=npdSingleTotal
			
			
			if (parseInt(localStorage.npdTotal)==1){
				localStorage.npdSkip=1;
			}
			
			for (var i=0; i < npdSingleTotal-1; i++){
				npdArray = npdSingleArray[i].split('fdfd');
				localStorage.npdArrayTotal=npdArray.length;
				
				itemID=npdArray[0];
				itemName=npdArray[1];
				minQty_npd=npdArray[2];
				npd_image=npdArray[3];
				
				
				var i_text=i.toString()
				var ItemQtynpd='ItemQtynpd_'+i_text
				var Itemnpd='Itemnpd_'+i_text
				var minQty='minQty_npd_'+i_text
				
				var npd_image_div='npd_image_div_'+i_text
				var npd_image_div_hidden='npd_image_div_hidden_'+i_text
				var npd_image_name_hidden='npd_image_name_hidden_'+i_text
				
				
				
				npdStringShow=npdStringShow+'<img src="'+apipath_image+'static/uni_images/npd/'+npd_image+'" alt="NPD" />';
				
				npdStringShow=npdStringShow+'<tr ><td>&nbsp;</td><td>'+itemName+
				'<input type="hidden" name="'+ Itemnpd +'" id="'+ Itemnpd +'" value="'+itemID+'" min="0">'+
				'<input type="hidden" name="'+ minQty +'" id="'+ minQty +'" value="'+minQty_npd+'" min="0">'+
				'</td>'+
				'<td width="60"><input type="number" name="'+ItemQtynpd +'" id="'+ ItemQtynpd +'" value="" min="0"></td><td width="5px">&nbsp;</td></tr>'
				npdStringShow=npdStringShow+'<tr height="1px" bgcolor="#CCCCCC" ><td></td><td></td><td> </td><td ></td></tr>'
				
				
				
				//====================	After
				npdStringShow=npdStringShow+'<table width="100%" border="0"><tr>'+
						'<td> <a data-role="button" href="#" onClick="get_pic_npd('+i_text+')" >Take Picture </a></td></tr></table>'+ 
						'<img id="'+npd_image_div+'" height="100px" width="100px"  src="" alt="NPDPic" />'+
						'<input type="hidden" name="'+ npd_image_div_hidden +'" id="'+ npd_image_div_hidden +'" value="" >'+
						'<input type="hidden" name="'+ npd_image_name_hidden +'" id="'+ npd_image_name_hidden +'" value="" >'
								
			}
			npdStringShow=npdStringShow+'</table>'
			localStorage.npdStringShow=npdStringShow
			$("#npd").html(localStorage.npdStringShow);
			
	//=====================Create Fixed Display list
	
			var fdisplaySlabArray = fdisplayList.split('</slab>');
			var fdisplaySlabTotal = fdisplaySlabArray.length;
			
			
			var fdisplayStringShow=''
			var fdisplayStringShowBefore=''
			fdisplayStringShow=fdisplayStringShow+'<table width="100%" border="0"><tr style="color:#0329C0"> <td colspan="2" style="color:#006A6A; font-size:18px;">'+localStorage.routeIDName+'<br>'+localStorage.outletNameID+'</td></tr><tr > </table></br>'
			
			
			fdisplayStringShowBefore=fdisplayStringShowBefore+'<table width="100%" border="0"><tr style="color:#0329C0"> <td colspan="2" style="color:#006A6A; font-size:18px;">'+localStorage.routeIDName+'<br>'+localStorage.outletNameID+'</td></tr><tr > </table></br>'
			
			
			
			localStorage.fdisplaySlabTotal=fdisplaySlabTotal
			
			if (parseInt(localStorage.fdisplaySlabTotal)==1){
				localStorage.fdSkip=1;
			}
			
			for (var slab=0; slab < fdisplaySlabTotal-1; slab++){
					//alert (fdisplaySlabArray[slab]);
					var fdisplaySlabList = fdisplaySlabArray[slab].replace("<slab>","");
					var fdisplaySlab_1Array = fdisplayList.split('<slab>');
					
					var fdisplaySlab_image = fdisplaySlabArray[slab].split('<slab>')[0].split('<fdfd>')[1];
					var fdisplaySlab_name = fdisplaySlabArray[slab].split('<slab>')[0].split('<fdfd>')[0];
					
					var slab_text=slab.toString()
					var fdSL_image_div='fdSL_image_div_'+slab_text
					var fdSL_image_div_hidden='fdSL_image_div_hidden_'+slab_text
					var fdSL_image_name_hidden='fdSL_image_name_hidden_'+slab_text
					
					var fdSL_image='fdSL_image_'+slab_text
					var fdSL_image_div='fdSL_image_div_'+slab_text
					var fdSLfdisplay='fdSLfdisplay_'+slab_text
					
				//	alert (apipath_image+'static/uni_images/display/'+fdisplaySlab_image)
					//fdisplayStringShow=fdisplayStringShow+'<div id="fddiv_'+slab.toString()+'">'
					fdisplayStringShow=fdisplayStringShow+'</br></br><table width="100%" border="0"> <tr><td style=" font-weight:bold; font-size:28px color:#006A6A; background:#FFECFF">'+fdisplaySlab_name+'</td> </tr></table>';
					fdisplayStringShow=fdisplayStringShow+'<img height="100px" width="100%"  src="'+apipath_image+'static/uni_images/display/'+fdisplaySlab_image+'" alt="FixedDisplay" />';
					
					fdisplayStringShow=fdisplayStringShow+'<table width="100%" border="0" cellpadding="0" cellspacing="0">'
					
					fdisplayStringShow=fdisplayStringShow+'<tr bgcolor="#9FCED7" ><td width="1%" >&nbsp;</td><td >Item</td> <td width="50px">QTY</td><td></td><td width="50px">Face Up</td><td></td><td width="100px">Order</td></tr>'
					
					var fdisplaySingleArray = fdisplaySlabList.split('rdrd');	
					var fdisplaySingleTotal = fdisplaySingleArray.length;
					var fdisplayTotal='fdisplayTotal'+slab.toString()
					var fdSL_total_hidden='fdSL_total_hidden_'+slab.toString()
					
					localStorage.fdisplayTotal=fdisplaySingleTotal
					
					for (var i=0; i < fdisplaySingleTotal-1; i++){
						var test=fdisplaySingleArray[i].replace(fdisplaySlabArray[slab].split('<slab>')[0],"");
						fdisplayArray = test.split('fdfd');
						
						
						
						//alert (test);
						slab_fdisplay=fdisplayArray[0]
						itemID=fdisplayArray[1];
						itemName=fdisplayArray[2];
						fdSL_fdisplay=fdisplayArray[3];
						var i_text=i.toString()
						var ItemQtyfdisplay='ItemQtyfdisplay_'+slab_text+'_'+i_text
						var Itemfdisplay='Itemfdisplay_'+slab_text+'_'+i_text
						
						var ItemFaceupfdisplay='ItemFaceupfdisplay_'+slab_text+'_'+i_text
						var ItemVisiblefdisplay='ItemVisiblefdisplay_'+slab_text+'_'+i_text
						var slabfdisplay='slabfdisplay_'+slab_text+'_'+i_text
						//var fdSLfdisplay='fdSLfdisplay_'+i_text
						
						
						//alert (fdisplaySingleArray[i])
						
						fdisplayStringShow=fdisplayStringShow+'<tr ><td width="1%" >&nbsp;</td><td>'+itemName+'<input type="hidden" name="'+ Itemfdisplay +'" id="'+ Itemfdisplay +'" value="'+itemID+'" min="0"> <input type="hidden" name="'+ slabfdisplay +'" id="'+ slabfdisplay +'" value="'+slab_fdisplay+'" min="0"></td>'+
										  '<td><input  onClick="checkQtyFd(/'+slab_text+'_'+i_text+'/)" onKeyUp="checkQtyFd(/'+slab_text+'_'+i_text+'/)" type="number" name="'+ItemQtyfdisplay +'" id="'+ ItemQtyfdisplay +'" value="" min="0"></td><td></td>'+
										  '<td><input onKeyUp="checkQtyFd(/'+slab_text+'_'+i_text+'/)" type="number" name="'+ItemFaceupfdisplay +'" id="'+ ItemFaceupfdisplay +'" value="" min="0"></td>'+
										  '<td></td><td><label  style="width:5px; height:8px"><input type="checkbox" name="'+ ItemVisiblefdisplay +'" id="'+ ItemVisiblefdisplay +'" value=""/></label></td></tr>'
						fdisplayStringShow=fdisplayStringShow+'<tr height="1px" bgcolor="#CCCCCC" ><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
						
					}
					fdisplayStringShow=fdisplayStringShow+'</table>'
					fdisplayStringShow=fdisplayStringShow+'</div>'	
					
					
//====================	before
				//Before Start
					
					fdisplayStringShowBefore=fdisplayStringShowBefore+'</br></br><table width="100%" border="0"> <tr><td style=" font-weight:bold; font-size:28px color:#006A6A; background:#FFECFF">'+fdisplaySlab_name+'</td> </tr></table>';
					fdisplayStringShowBefore=fdisplayStringShowBefore+'<img height="100px" width="100%"  src="'+apipath_image+'static/uni_images/display/'+fdisplaySlab_image+'" alt="FixedDisplay" />';
					
	
					fdisplayStringShowBefore=fdisplayStringShowBefore+'<table width="100%" border="0"><tr>'+
							'<td> <a data-role="button" href="#" onClick="get_pic_fdisplay_before('+slab+')" >Take Picture Before </a></td></tr></table>'+ 
							//alert (fdSL_image_div);
							'<img id="'+ fdSL_image_div +'_before" height="100px" width="100px"  src="" alt="FixedDisplay" />'+ 
							
							
							'<input type="hidden" name="'+ fdSL_image_div_hidden +'_before" id="'+ fdSL_image_div_hidden +'_before" value="" >'+
							'<input type="hidden" name="'+ fdSL_image_name_hidden +'_before" id="'+ fdSL_image_name_hidden +'_before" value="" >'
							
							
					
					
//====================	After
					fdisplayStringShow=fdisplayStringShow+'<table width="100%" border="0"><tr>'+
							'<input type="hidden" name="'+ fdSLfdisplay +'" id="'+ fdSLfdisplay +'" value="'+fdSL_fdisplay+'" min="0">  '+
							'<td> <a data-role="button" href="#" onClick="get_pic_fdisplay('+slab+')" >Take Picture </a></td></tr></table>'+ 
							'<img id="'+fdSL_image_div+'" height="100px" width="100px"  src="" alt="FixedDisplay" />'+
							'<input type="hidden" name="'+ fdSL_image_div_hidden +'" id="'+ fdSL_image_div_hidden +'" value="" >'+
							'<input type="hidden" name="'+ fdSL_image_name_hidden +'" id="'+ fdSL_image_name_hidden +'" value="" >'+
							'<input type="hidden" name="'+ fdSL_total_hidden +'" id="'+ fdSL_total_hidden +'" value="'+fdisplaySingleTotal+'" >'
										
			}
			
			
			localStorage.fdisplayStringShowBefore=fdisplayStringShowBefore
			$("#fdisplayStringShowBefore").html(localStorage.fdisplayStringShowBefore);
			
			localStorage.fdisplayStringShow=fdisplayStringShow
			$("#fdisplay").html(localStorage.fdisplayStringShow);
			
			
			

			//==========Create QPDS Display list
			
			
		//	alert (qpdsList);
			var qpdsSlabArray = qpdsList.split('</scheme>');
			var qpdsSlabTotal = qpdsSlabArray.length;
			
			var qpdsStringShow=''
			qpdsStringShow=qpdsStringShow+'<table width="100%" border="0"><tr style="color:#0329C0"> <td colspan="2" style="color:#006A6A; font-size:18px;">'+localStorage.routeIDName+'<br>'+localStorage.outletNameID+'</td></tr><tr > </table></br>'
			
			localStorage.qpdsSlabTotal=qpdsSlabTotal
			if (parseInt(localStorage.qpdsSlabTotal)==1){	
				localStorage.qpdsSkip=1;	
			}
			
			for (var slab=0; slab < qpdsSlabTotal-1; slab++){
				
				var qpdsSlab_1Array = qpdsSlabArray[slab].split('<scheme>');
				var qpdsSlab_image = qpdsSlab_1Array[0];
				
				var qpdsSlabList = qpdsSlab_1Array[1].replace("<scheme>","");
				
				qpdsStringShow=qpdsStringShow+'<div id="qpdsdiv_'+slab.toString()+'">'				
				qpdsStringShow=qpdsStringShow+'<img height="100px"  src="'+apipath_image+'static/uni_images/scheme/'+qpdsSlab_image+'" alt="QPDS" />';
				qpdsStringShow=qpdsStringShow+'<table width="100%" border="0" cellpadding="0" cellspacing="0">'				
				qpdsStringShow=qpdsStringShow+'<tr bgcolor="#9FCED7" ><td width="1%" >&nbsp;</td><td >Item</td> <td width="50px">QTY</td><td></td><td width="50px">  </td><td></td><td>Visible</td></tr>'
				
				var qpdsSingleArray = qpdsSlabList.split('rdrd');	
				var qpdsSingleTotal = qpdsSingleArray.length;
														
				var qpdsSL_image_div='qpdsSL_image_div_'+slab.toString()
				var qpdsSL_image_div_hidden='qpdsSL_image_div_hidden_'+slab.toString()
				var qpdsSL_image_name_hidden='qpdsSL_image_name_hidden_'+slab.toString()
				
				var qpdsSL_total_hidden='qpdsSL_total_hidden_'+slab.toString()
				
				var qpdsSL_f='qpdsSL_'+slab.toString()
				
				localStorage.qpdsTotal=qpdsSingleTotal

				for (var i=0; i < qpdsSingleTotal-1; i++){
					qpdsArray = qpdsSingleArray[i].split('fdfd');
					scheme_qpds=qpdsArray[0]
					itemID=qpdsArray[1];
					itemName=qpdsArray[2];
					qpdsSL=qpdsArray[3];
					
					var i_text=i.toString()
					var slab_text=slab.toString()
					var ItemQtyqpds='ItemQtyqpds_'+slab.toString()+'_'+i_text
					var Itemqpds='Itemqpds_'+slab.toString()+'_'+i_text
					var ItemFaceupqpds='ItemFaceupqpds_'+slab.toString()+'_'+i_text
					var ItemVisibleqpds='ItemVisibleqpds_'+slab.toString()+'_'+i_text
					var schemeqpds='schemeqpds_'+slab.toString()+'_'+i_text											

					qpdsStringShow=qpdsStringShow+
								   '<tr ><td width="1%" >&nbsp;</td><td>'+itemName+'<input type="hidden" name="'+ Itemqpds +'" id="'+ Itemqpds +'" value="'+itemID+'" min="0">'+
								   '<input type="hidden" name="'+ schemeqpds +'" id="'+ schemeqpds +'" value="'+scheme_qpds+'" min="0"> </td>'+
								   '<td><input onClick="checkQtyQpds('+i+')" onKeyUp="checkQtyQpds(/'+slab_text+'_'+i_text+'/)"  type="number" name="'+ItemQtyqpds +'" id="'+ ItemQtyqpds +'" value="" min="0"></td>'+
								   '<td></td><td><input onKeyUp="checkQtyQpds(/'+slab_text+'_'+i_text+'/)" type="hidden" name="'+ItemFaceupqpds +'" id="'+ ItemFaceupqpds +'" value="" min="0"></td><td></td>'+
								   '<td><label  style="width:5px; height:8px"><input type="checkbox" name="'+ ItemVisibleqpds +'" id="'+ ItemVisibleqpds +'" value=""/></label></td></tr>'
					qpdsStringShow=qpdsStringShow+'<tr height="1px" bgcolor="#CCCCCC" ><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
				}
				qpdsStringShow=qpdsStringShow+'</table>'
				qpdsStringShow=qpdsStringShow+'</div>'
				
				
				
				//After================
				
				qpdsStringShow=qpdsStringShow+
							  '<table width="100%" border="0"><tr><td>'+
							  ' <input type="hidden" name="'+ qpdsSL_f +'" id="'+ qpdsSL_f +'" value="'+qpdsSL+'" min="0">  '+
							  ' <a data-role="button" href="#" onClick="get_pic_qpds('+slab+')" >Take Picture </a></td></tr></table>'
				
				//alert (qpdsSL);
				
				 qpdsStringShow=qpdsStringShow+
						'<img id="'+qpdsSL_image_div+'" height="100px" width="100px"  src="" alt="Promotion" />'+
						'<input type="hidden" name="'+ qpdsSL_image_div_hidden +'" id="'+ qpdsSL_image_div_hidden +'" value="" >'+
						'<input type="hidden" name="'+ qpdsSL_image_name_hidden +'" id="'+ qpdsSL_image_name_hidden +'" value="" >'+
						'<input type="hidden" name="'+ qpdsSL_total_hidden +'" id="'+ qpdsSL_total_hidden +'" value="'+qpdsSingleTotal+'" >'
		
		 
			}
			localStorage.qpdsStringShow=qpdsStringShow
			$("#qpds").html(localStorage.qpdsStringShow);								
								
								
			//==========Create Gift Ack list
			var giftSingleArray = giftList.split('rdrd');	
			var giftSingleTotal = giftSingleArray.length;
			
		//	alert (giftList);
			
			var giftStringShow=''


			//==========Create Marchandizing list
			
			var outletIDnameShow=''
			outletIDnameShow=outletIDnameShow+'<table width="100%" border="0"><tr style="color:#0329C0"> <td colspan="2" style="color:#006A6A; font-size:18px;">'+localStorage.routeIDName+'<br>'+localStorage.outletNameID+'</td></tr><tr > </table></br>'
			localStorage.outletIDnameShow=outletIDnameShow
			//===============================
			
			
			//mar item list				
			var mar_item_array = marchadizingItemList.split('rdrd');																								
			marItemCmbo='<select name="select_posm" id="select_posm" data-mini="true" ><option value="">Select POSM</option>';
			for (var i=0; i < mar_item_array.length-1; i++){
				var marItemS= mar_item_array[i].split('fdfd');					
				marItemCmbo+='<option value="'+marItemS[0]+'|'+marItemS[1]+'|'+marItemS[2]+'">'+marItemS[1]+' |'+marItemS[2]+'</option>';			  	
			}
			marItemCmbo=marItemCmbo+'</select>';			
			localStorage.marItemCmbo=marItemCmbo;
			
			
			
			//competitor item list				
			var competitor_array = cpmpetitorList.split('rdrd');																								
			competitorCmbo='<select name="select_comp" id="select_comp" data-mini="true" ><option value="">Select Competitor</option>';
			for (var i=0; i < competitor_array.length-1; i++){
				var competitor= competitor_array[i].split('fdfd');					
				competitorCmbo+='<option value="'+competitor[0]+'">'+competitor[0]+'</option>';			  	
			}
			competitorCmbo=competitorCmbo+'</select>';			
			localStorage.competitorCmbo=competitorCmbo;
			
			//competitor question list
						
			competitorQCmbo='<select name="select_comp_q" id="select_comp_q" data-mini="true" ><option value="">Select Question</option>';
			for (var m=0; m < competitor_array.length-1; m++){
				var competitorQ= competitor_array[m].split('fdfd');					
				competitorQCmbo+='<option value="'+competitorQ[1]+'">'+competitorQ[1]+'</option>';			  	
			}
			competitorQCmbo=competitorQCmbo+'</select>';			
			localStorage.competitorQCmbo=competitorQCmbo;
			
			
			
			//competitor info	
			var comInfoStr='';
			comInfoStr=comInfoStr+'<table width="100%" border="0" cellpadding="0" cellspacing="0">'				
			comInfoStr=comInfoStr+'<tr bgcolor="#9FCED7" ><td width="1%" >&nbsp;</td><td >Brand</td> <td width="50px">SKU</td><td width="50px">Qty</td><td>TP</td><td>MRP</td></tr>'
				
			var competitor_info = cpmpetitorList.split('rdrd');		
			for (var i=0; i < competitor_info.length-1; i++){
				comInStr= competitor_info[i].split('fdfd');
				brand=comInStr[0];					
				skau=comInStr[1];
				
				var iText=i.toString()
				var brandID='brandID_'+iText
				var skauID='skauID_'+iText
				var comQty='comQty_'+iText
				var comTp='comTp_'+iText
				var comMrp='comMrp_'+iText
				
				/*var compImage='compImage_'+iText
				var compImage_div='compImage_div_'+iText
				var compImage_image_div_hidden='compImage_image_div_hidden_'+iText
				var compImage_image_name_hidden='compImage_image_name_hidden_'+iText
				var compImage_total_hidden='compImage_total_hidden_'+iText*/
				//alert(brandID+'-'+skauID+'-'+comQty+'-'+comTp+'-'+comMrp);
				comInfoStr=comInfoStr+
								   //'<tr ><td width="1%" >&nbsp;</td><td>'+brand+'<input type="hidden" name="'+brandID+'" id="'+brandID+'" value="'+brand+'" min="0"></td><td>'+skau+'<input type="hidden" name="'+skauID+'" id="'+skauID+'" value="'+skau+'" min="0"></td><td> <input type="number" name="" id="" value="" min="0"></td><td> <input type="number" name="" id="" value="" min="0"></td><td> <input type="number" name="" id="" value="" min="0"></td></tr>'
								   '<tr ><td width="1%" >&nbsp;</td><td>'+brand+'<input type="hidden" name="'+brandID+'" id="'+brandID+'" value="'+brand+'" min="0"></td><td>'+skau+'<input type="hidden" name="'+skauID+'" id="'+skauID+'" value="'+skau+'" min="0"></td><td> <input onClick="checkCompQty('+iText+')" onKeyUp="checkCompQty(/'+iText+'/)" type="number" name="'+comQty+'" id="'+comQty+'" value="" min="0"></td><td> <input onClick="checkCompQty('+iText+')" onKeyUp="checkCompQty(/'+iText+'/)" type="number" name="'+comTp+'" id="'+comTp+'" value="" min="0"></td><td> <input onClick="checkCompQty('+iText+')" onKeyUp="checkCompQty(/'+iText+'/)" type="number" name="'+comMrp+'" id="'+comMrp+'" value="" min="0"></td></tr>'
				comInfoStr=comInfoStr+'<tr height="1px" bgcolor="#CCCCCC" ><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
							  	
			}
			comInfoStr=comInfoStr+'</table>'			
			localStorage.competitorInfo=comInfoStr;
			//alert(localStorage.competitorInfo);
			$("#comInfoStoc").html(localStorage.competitorInfo);
			
			/*var compImageStr='';
			compImageStr=compImageStr+
				'<table width="100%" border="0"><tr><td>'+
				' <input type="hidden" name="'+ compImage +'" id="'+ compImage +'" min="0"> '+
				' <a data-role="button" href="#" onClick="get_pic_competitor()" >Take Picture </a></td></tr></table>'	
				  
			compImageStr=compImageStr+
				'<img id="'+compImage_div+'" height="100px" width="100px"  src="" alt="Display" />'+
				'<input type="hidden" name="'+ compImage_image_div_hidden +'" id="'+ compImage_image_div_hidden +'" value="" >'+
				'<input type="hidden" name="'+ compImage_image_name_hidden +'" id="'+ compImage_image_name_hidden +'" value="" >'+
				'<input type="hidden" name="'+ compImage_total_hidden +'" id="'+ compImage_total_hidden +'" value="'+compImageTotal+'" >'
				
			
			localStorage.competitorImage=compImageStr;
			$("#comImageDisplay").html(localStorage.competitorImage);*/
			
			
			var mustHaveStr='';
			mustHaveStr=mustHaveStr+'<table width="100%" border="0" cellpadding="0" cellspacing="0">'				
			mustHaveStr=mustHaveStr+'<tr bgcolor="#9FCED7" ><td >&nbsp;</td><td >Brand</td> <td >SKU</td><td width="50px">Actual Qty</td></tr>'
				
			var must_have_sku = mustHaveList.split('rdrd');		
			for (var i=0; i < must_have_sku.length-1; i++){
				mustStr= must_have_sku[i].split('fdfd');
				channel=mustStr[0];
				brandMustHav=mustStr[1];					
				skau_name=mustStr[2];
				normal_qty=mustStr[3];					
				actual_qty=mustStr[4];
				
				var itexT=i.toString()
				var brandMustHavID='brandMustHavID_'+itexT
				var skauName='skauName_'+itexT
				//var normalQty='normalQty_'+itexT
				var actualQty='actualQty_'+itexT
				
				mustHaveStr=mustHaveStr+
								   '<tr ><td >&nbsp;</td><td>'+brandMustHav+'<input type="hidden" name="'+brandMustHavID+'" id="'+brandMustHavID+'" value="'+brandMustHav+'" min="0"></td><td>'+skau_name+'<input type="hidden" name="'+skauName+'" id="'+skauName+'" value="'+skau_name+'" min="0"></td><td width="80px"> <input type="number" name="'+actualQty+'" id="'+actualQty+'" value="" min="0"></td></tr>'
				
				mustHaveStr=mustHaveStr+'<tr height="1px" bgcolor="#CCCCCC" ><td></td><td></td><td></td><td></td></tr>'
							  	
			}
			mustHaveStr=mustHaveStr+'</table>'			
			localStorage.mustHaveSkau=mustHaveStr;
			$("#mustHaveSku").html(localStorage.mustHaveSkau);
			
		//	===========dynamic modal form for new marchandizing end================
								
			var startTime=get_date()
			localStorage.startTime=startTime
			//alert (startTime);
			$("#startTime").val(localStorage.startTime);
			
			$("#outletButton").show();
			$("#outletWait").hide();
								
		}
			
			  
}
//=====================Select Outlet End=========================

//=====================Route Exception start=====================
function selectRouteException() { 
	var selected_route_exception=($("input:radio[name='RadioRouteEx']:checked").val())
	if(selected_route_exception==undefined){
		$(".errMsg").html("Required Exception");
	}else{
		localStorage.routeException=selected_route_exception;
		$(".errMsg").html("");
		var url = "#menuPage";
		$.mobile.navigate(url);	
	}
}
//=====================Route Exception end=====================



function qpds_ready_data() { 
	//===============QPDS data==================
	var qpds_imageName=0
	var qpds_data="";
	var qpds_data_detail="";
	var qpds_data_head="";
	var qpds_image_flag=0;	
	var error_qty_flag_qpds=0;
	for (var i=0; i < localStorage.qpdsSlabTotal-1; i++){
		var qpdsSL_image_path=$("#qpdsSL_image_div_hidden_"+i.toString()).val(); 
		var qpdsSL_image_name=$("#qpdsSL_image_name_hidden_"+i.toString()).val(); 
		//alert(qpdsSL_image_name);
		var qpdsSL_image_path_before=$("#qpdsSL_image_div_hidden_"+i.toString()+"_before").val(); 
		var qpdsSL_image_name_before=$("#qpdsSL_image_name_hidden_"+i.toString()+"_before").val(); 		
				
		var qpdsSL=$("#qpdsSL_"+i.toString()).val();
		
		var qpdsTotal='qpdsTotal'+i.toString()
		var qpdsTotal_1=$("#qpdsSL_total_hidden_"+i.toString()).val();
		
		
		//alert(qpdsSL_image_name+'==='+qpdsSL_image_path.length);
		
		if (qpdsSL_image_path.length<10){
			qpds_image_flag=1
		}
		//alert(qpdsSL_image_name);
		if(qpdsSL_image_name=='' || qpdsSL_image_name==undefined){
			qpds_imageName=1
		}
		
		for (var d=0; d < qpdsTotal_1-1; d++){
			var ItemQtyqpds= $("#ItemQtyqpds_"+i.toString()+"_"+d.toString()).val();  
			var Itemqpds= $("#Itemqpds_"+i.toString()+"_"+d.toString()).val();  
			var ItemFaceupqpds=$("#ItemFaceupqpds_"+i.toString()+"_"+d.toString()).val();   
			var schemeqpds=$("#schemeqpds_"+i.toString()+"_"+d.toString()).val(); 
			
			
 
			var ItemVisibleqpds_f="#ItemVisibleqpds_"+i.toString()+"_"+d.toString();
     		var ItemVisibleqpds_g= ($(ItemVisibleqpds_f).is(':checked') ? 1 : 0);
			
			if (ItemVisibleqpds_g==0){
				ItemVisibleqpds='NO'
			}
			if (ItemVisibleqpds_g==1){
				ItemVisibleqpds='YES'
			}
			
			
			if  ((ItemQtyqpds.length < 1) || (ItemVisibleqpds=='NO')){
					error_qty_flag_qpds=1;
			}
			
			
			qpds_data_detail=qpds_data_detail+Itemqpds+'fdfd'+ItemQtyqpds+'fdfd'+ItemFaceupqpds+'fdfd'+ItemVisibleqpds+'fdfd'+schemeqpds+'fdfd'+qpdsSL+'rdrd'
		}
		qpds_data_detail=qpds_data_detail+'detaildetail'
		qpds_data_head=qpds_data_head+schemeqpds+'fdfd'+qpdsSL+'fdfd'+qpdsSL_image_name+'fdfd'+qpdsSL_image_path+'fdfd'+qpdsSL_image_name_before+'fdfd'+qpdsSL_image_path_before+'rdrd'
	
	}
	qpds_data='headstart'+qpds_data_head+'headend'+qpds_data_detail
	localStorage.qpds_data_ready=qpds_data;
	
	qpds_page_set();
	
	if (localStorage.latlongSubmit==1){
		$("#submit_data").html("Location Confirmed");
	}
	
	
	//==============
	
	//Local-----------------
	error_qty_flag_qpds=0
	qpds_image_flag=0
	
	//--------------------
	
	//alert(qpds_image_flag);
	
	if (error_qty_flag_qpds==1){		
		var url = "#qpdsPage";
		$.mobile.navigate(url);
		
	}else if (qpds_image_flag==1){	
		$('.errMsg').text("Require Image");		
		var url = "#qpdsPage";
		$.mobile.navigate(url);
		
	}else if (qpds_imageName==1){	
		$('.errMsg').text("Require Image");	
		var url = "#qpdsPage";
		$.mobile.navigate(url);	
	}else{		
		$('#mar_cmbo_show').empty();
		$('#mar_cmbo_show').append(localStorage.marItemCmbo);		
		$('.errMsg').text("");
		//var url="#submitPage";
		var url="#competitor_info_stock";
		$.mobile.navigate(url);
	
	}
	
	//==================
	
}

// competitor_info
function competitor_info_stock_data(){
	var comInfoStockData='';
	cpmpetitorStr=localStorage.competitorList.split(',')
		for (var i=0; i < cpmpetitorStr.length-1; i++){
			
		var compBrandID=$("#brandID_"+i.toString()).val(); 
		var compSkauID=$("#skauID_"+i.toString()).val();
		var compComQty=$("#comQty_"+i.toString()).val();
		var compComTp=$("#comTp_"+i.toString()).val();
		var compComMrp=$("#comMrp_"+i.toString()).val();
		
		if(comInfoStockData==""){
			comInfoStockData=compBrandID+'fdfd'+compSkauID+'fdfd'+compComQty+'fdfd'+compComTp+'fdfd'+compComMrp;
		}else{
			comInfoStockData +='rdrd'+compBrandID+'fdfd'+compSkauID+'fdfd'+compComQty+'fdfd'+compComTp+'fdfd'+compComMrp;
		}
	}
	localStorage.comInfStData=comInfoStockData;
	//alert(comInfoStockData);
	$(".errMsg").html("");
	$.mobile.navigate("#competitor_info_display");	
}
var fromDate;
var toDate;
var monthlyTK;
var imagePathA="";
var imagePathB="";
function competitor_info_display_data(){
	
	fromDate=$("#fromDate").val();
	toDate=$("#toDate").val();
	monthlyTK=$("#monthlyTK").val();
	achPhoto_display=$("#achPhoto_display").val();
	
	fromDate_chk=fromDate.split('/');	
	fDate_chk=new Date(fromDate_chk[1]+"/"+ fromDate_chk[2]+"/"+fromDate_chk[0]);	
	toDate_chk=toDate.split('/');	
	tDate_chk=new Date(toDate_chk[1]+"/"+ toDate_chk[2]+"/"+toDate_chk[0]);
	
	today = new Date()
	
	if(fDate_chk > tDate_chk){
		$(".errMsg").html("Invalid Display Period Date");
	}else{
		comp_ready_data()
		
		$.mobile.navigate("#competitor_info_posm");
	}
}
	


function comp_ready_data() { 
	var comp_data="";
	var image_name=$("#achPhoto_display_name").val();
	var comp_image_path=$("#achPhoto_display_div").val();
	comp_data=comp_data+image_name+'fdfd'+comp_image_path+'rdrd';
	localStorage.comp_data_ready=comp_data
		
	comp_page_set();
}

function comp_page_set() { 
	var comp_data =  localStorage.comp_data_ready.replace("rdrd","");
	var comp_array =  comp_data.split('fdfd');
	var image_name = comp_array[0];
	var comp_image_path = comp_array[1];
	//alert (image_name)
	$("#achPhoto_display_name").val(image_name);
	$("#achPhoto_display_div").val(comp_image_path);
	
	//alert (image_name)
	var image = document.getElementById('myImageA_display');
    image.src = comp_image_path;
	
}


function must_have_sku(){	
	
	achPhoto_posm=$("#achPhoto_posm").val();
	/*if(achPhoto_posm=="" || achPhoto_posm==undefined){
		$(".errMsg").html("Please confirm Photo");
	}else{*/
		posm_ready_data()
		$(".errMsg").html("");
		$.mobile.navigate("#must_have_sku");
	//}	
}

function posm_ready_data() { 
	var posm_data="";
	var image_name=$("#achPhoto_posm_name").val();
	var posm_image_path=$("#achPhoto_posm_div").val();
	posm_data=posm_data+image_name+'fdfd'+posm_image_path+'rdrd';
	localStorage.posm_data_ready=posm_data
		
	posm_page_set();
}

function posm_page_set() { 
	var posm_data =  localStorage.posm_data_ready.replace("rdrd","");
	var posm_array =  posm_data.split('fdfd');
	var image_name = posm_array[0];
	var posm_image_path = posm_array[1];
	//alert (image_name)
	$("#achPhoto_posm_name").val(image_name);
	$("#achPhoto_posm_div").val(posm_image_path);
	
	//alert (image_name)
	var image = document.getElementById('myImageA_posm');
    image.src = posm_image_path;
	
}



function must_have_sku_data(){
	var mustHaveData='';
	mhStr=localStorage.musthaveSku_str.split(',')
		for (var i=0; i < mhStr.length-1; i++){
			
		var bMHavID=$("#brandMustHavID_"+i.toString()).val(); 
		var skuName=$("#skauName_"+i.toString()).val();
		var actQty=$("#actualQty_"+i.toString()).val();
		//alert(actQty);
		if(mustHaveData==""){
			mustHaveData=bMHavID+'fdfd'+skuName+'fdfd'+actQty;
		}else{
			mustHaveData +='rdrd'+bMHavID+'fdfd'+skuName+'fdfd'+actQty;
		}
	}
	localStorage.mustHData=mustHaveData;
	//alert(mustHaveData);
	
	$(".errMsg").html("");
	$.mobile.navigate("#submitPage");			
}

//competitor_info end


function qpds_page_set() { 

if (localStorage.qpds_data_ready.length > 10){
	var qpds_array =  localStorage.qpds_data_ready.split('headend');
	var qpds_head=qpds_array[0].replace("headstart","");
	var qpds_detail=qpds_array[1];
	
	
	
	var qpds_head_array =  qpds_head.split('rdrd');
	
	
	//alert (localStorage.qpdsSlabTotal)
	for (var i=0; i < localStorage.qpdsSlabTotal-1; i++){
		//alert (qpds_head_array[i]);
		var head_s_array=qpds_head_array[i].split('fdfd');
		var slabqpds =head_s_array[0];
		var qpdsTotal=head_s_array[1];
		
		var qpdsImg=head_s_array[2];
		var qpdsImg_path=head_s_array[3];
		//alert(qpdsImg+'---'+qpdsImg_path);
		
		$("#qpdsSL_image_name_hidden_"+i.toString()).val(qpdsImg);
		$("#qpdsSL_image_div_hidden_"+i.toString()).val(qpdsImg_path);
		
		
		var image = document.getElementById('qpdsSL_image_div_'+i.toString());
		image.src = qpdsImg_path;
		
		
		
		var qpds_detail_array =  qpds_detail.split('detaildetail');
		var qpds_detail_n =  qpds_detail_array[i];
		var qpds_detail_s_array_1=qpds_detail_n.split('rdrd');
		var qpdsDTotal=qpds_detail_s_array_1.length
			
			for (var d=0; d < qpdsDTotal-1; d++){
				
				var qpds_detail_s_array =  qpds_detail_s_array_1[d].split('fdfd');
				
				var ItemQtyqpds = qpds_detail_s_array[1];
				var ItemFaceupqpds = qpds_detail_s_array[2];
				var ItemVisibleqpds = qpds_detail_s_array[3];
				
				
				
				$("#ItemQtyqpds_"+i.toString()+"_"+d.toString()).val(ItemQtyqpds);
				$("#ItemFaceupqpds_"+i.toString()+"_"+d.toString()).val(ItemFaceupqpds);
				if (ItemVisibleqpds=='YES'){
					$("#ItemVisibleqpds_"+i.toString()+"_"+d.toString()).attr('checked',true);
				}

			}
	}
}// End if

if (localStorage.qpds_next_flag==1){
	$('#qpds').find('input, textarea, button, select').attr('disabled','disabled');
	$('#qpds').addClass('disabledAnchor');	
}

}



function showPaidDisplay(){
	//alert(apipath+'showPaidDisplay?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&route='+localStorage.selectedRoute+'&outlet='+localStorage.selectedOutlet+'&channel='+localStorage.outletChannel)
	$('#outletScheme').empty();
	$.ajax({
			type: 'POST',
			url: apipath+'showPaidDisplay?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&route='+localStorage.selectedRoute+'&outlet='+localStorage.selectedOutlet+'&channel='+localStorage.outletChannel,
			 success: function(result) {					
					if (result==''){
						alert ('Sorry Network not available');
					}
					else{						
						schemeNameList=result.split('<fd>');						
						
						schemeCmbo='<select id="schemeQpds">'
						for (i=0;i<schemeNameList.length;i++){
							
							schemeCmbo+='<option value="'+schemeNameList[i]+'">'+schemeNameList[i]+'</option>';
							}
						schemeCmbo+='</select>'
						$('#outletScheme').html(schemeCmbo).trigger('create');
						
						
						var url = "#newPaidDisplayPage";
						$.mobile.navigate(url);
					}
			 }
		 })
	
	
	}

function addPaidDisplay(){
	schemeQpds=$("#schemeQpds").val();
	
	//alert(apipath+'addPaidDisplay?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&route='+localStorage.selectedRoute+'&outlet='+localStorage.selectedOutlet+'&channel='+localStorage.outletChannel+'&schemeQpds='+encodeURIComponent(schemeQpds) )
	
	$.ajax({
			type: 'POST',
			url: apipath+'addPaidDisplay?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&route='+localStorage.selectedRoute+'&outlet='+localStorage.selectedOutlet+'&channel='+localStorage.outletChannel+'&schemeQpds='+encodeURIComponent(schemeQpds),
			 success: function(result) {					
					if (result==''){
						alert ('Sorry Network not available');
					}else{									
						$(".errMsg").text(result);
						
												
						var url = "#submitPage";
						$.mobile.navigate(url);
						
					}
			 }
		 })	
	}






function submit_data() { 
	
	//munu_page_check();
	$("#location_button").hide();
	$("#sub_button").hide();
	
	$("#submit_data").html('<img height="40px" width="40px" src="loading.gif">');
	//=========================AJAX Submit==========================	
	var lat=$( "#lat").val();
	var long=$( "#long").val();
	var visitDate=get_date().split(' ')[0];
    var endTime=get_date();
	var salfieImage=$("#salfie_image_name_hidden").val();
	var giftImage=$( "#gift_image_name_hidden").val();
	
	var display_comp_name=$("#achPhoto_display_name").val();
	var posm_comp_name=$("#achPhoto_posm_name").val();
	
	var latlong="0,0";
	
	if (lat==0 && long==0){		
		latlong=localStorage.preLatitude.toString()+","+localStorage.preLongitude.toString();
	}else{
		latlong=lat.toString()+","+long.toString()
	}
	
		
	$( "#sub_button_div").hide();
	
	if (localStorage.mar_distrib_data==undefined || localStorage.mar_distrib_data=="undefined"){
		localStorage.mar_distrib_data=""
	}
	
	var fdisplay_data=""; //localStorage.fdisplay_data_ready.replace('detaildetail','')
	var qpds_data=localStorage.qpds_data_ready.replace('detaildetail','')
	
	//alert(apipath+'syncSubmitData?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&route='+localStorage.selectedRoute+'&routeEx='+localStorage.routeException+'&outlet='+localStorage.selectedOutlet+'&scheduleDate='+ localStorage.selected_date +'&outletEx=&channel='+localStorage.outletChannel+'&latlong='+latlong+'&visitDate='+visitDate+'&startTime='+localStorage.startTime+'&endTime='+endTime+'&comInfoStockData='+localStorage.comInfStData+'&fromDate='+fromDate+'&toDate='+toDate+'&monthlyTK='+monthlyTK+'&imageName='+display_comp_name+'&imageNamePosm='+posm_comp_name+'&mustHaveData='+localStorage.mustHData+'&giftImage=&mhskus_data=&npd_data=&fdisplay_data=&qpds_data='+encodeURIComponent(qpds_data)+'&salfie_data=&gift_data=&place_data=&shop_data='+localStorage.shop_data_ready+'&unpaid_data=&posm_data=&competitor_data=&self_data=&survey_data=0,0,0,0,0,0');
	
	$.ajax({
				type: 'POST',
				url: apipath+'syncSubmitData?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&route='+localStorage.selectedRoute+'&routeEx='+localStorage.routeException+'&outlet='+localStorage.selectedOutlet+'&scheduleDate='+ localStorage.selected_date +'&outletEx=&channel='+localStorage.outletChannel+'&latlong='+latlong+'&visitDate='+visitDate+'&startTime='+localStorage.startTime+'&endTime='+endTime+'&comInfoStockData='+localStorage.comInfStData+'&fromDate='+fromDate+'&toDate='+toDate+'&monthlyTK='+monthlyTK+'&imageName='+display_comp_name+'&imageNamePosm='+posm_comp_name+'&mustHaveData='+localStorage.mustHData+'&giftImage=&mhskus_data=&npd_data=&fdisplay_data=&qpds_data='+encodeURIComponent(qpds_data)+'&salfie_data=&gift_data=&place_data=&shop_data='+localStorage.shop_data_ready+'&unpaid_data=&posm_data=&competitor_data=&self_data=&survey_data=0,0,0,0,0,0',
				//url: apipath+'syncSubmitData?cid='+localStorage.cid+'&cm_id='+localStorage.cm_id+'&cm_pass='+localStorage.cm_pass+'&synccode='+localStorage.synccode+'&route='+localStorage.selectedRoute+'&routeEx='+localStorage.routeException+'&outlet='+localStorage.selectedOutlet+'&scheduleDate='+ localStorage.selected_date +'&outletEx='+localStorage.outletException+'&channel='+localStorage.outletChannel+'&latlong='+latlong+'&visitDate='+visitDate+'&startTime='+localStorage.startTime+'&endTime='+endTime+'&giftImage=&mhskus_data=&npd_data=&fdisplay_data=&qpds_data='+encodeURIComponent(qpds_data)+'&salfie_data=&gift_data=&place_data=&shop_data='+localStorage.shop_data_ready+'&unpaid_data=&posm_data=&competitor_data=&self_data=&survey_data=0,0,0,0,0,0',
				 success: function(result) {	
						
						if (result==''){
							alert ('Sorry Network not available');
						}
						else{

							if (result!='SUCCESS'){
								$("#submit_data_check").html(result);
								$("#submit_data").html('');
							}
							if (result=='SUCCESS'){
								
								//marchandising distribution
									
								localStorage.mar_distrib_data="";								
								//----- marchandising end
								
																
								localStorage.dataSubmit=1;
								buttonCheck();
								
								
								localStorage.show_cancel=0;

								var check_outlet= localStorage.outletString;

								localStorage.outletString=check_outlet.replace('<input type="radio" name="RadioOutlet" value="'+localStorage.selectedOutlet+'rdrd'+localStorage.selected_date_get+'">','<input type="radio" name="RadioOutlet" value="'+localStorage.selectedOutlet+'rdrd'+localStorage.selected_date_get+'" disabled="True">');
								
								//localStorage.outletString=outletStringShow
								//$("#outletString").html(localStorage.outletString);
								
								
								$("#outletString").empty();
			 					$("#outletString").append(localStorage.outletString).trigger('create');
								
								
															
								$("#submit_data_check").html("");
								$("#submit_data").html('');
								localStorage.step_flag=1;
								
								
								// Enable all disable div start
								//$('#mhskus').find('input, textarea, button, select').attr('disabled',false);
								//$('#npd').find('input, textarea, button, select').attr('disabled',false);
								//$('#fdisplayStringShowBefore').find('input, textarea, button, select').attr('disabled',false);
								//$('#fdisplay').find('input, textarea, button, select').attr('disabled',false);
								$('#qpds').find('input, textarea, button, select').attr('disabled',false);
								//$('#gift').find('input, textarea, button, select').attr('disabled',false);
								//$('#place_show').find('input, textarea, button, select').attr('disabled',false);
								//$('#shop_show').find('input, textarea, button, select').attr('disabled',false);
								
								// Enable disable div end
								
								
								//upload_shop();
								//cancel_outlet();
								
								//location.reload();
								
								
							}
							
									
						}
						
				      }, 
				  error: function(result) {
					 // alert (result);
					 $("#sub_button").show();
					 
					// $("#submit_data").html("Network timeout. Please ensure you have good network signal and working Internet.");
					 localStorage.dataSubmit=0;
					 buttonCheck();
					 var url = "#submitPage";
					 $.mobile.navigate(url);	
				  }
			  });//end ajax
	

}


//====================================Camera==========
function getAchivementImage_display() {
	var tempTime = $.now();
	display_image_name=tempTime.toString()+"_"+localStorage.selectedOutlet+"_display.jpg";
	//alert(display_image_name);
	$("#achPhoto_display_name").val(display_image_name);
	$("#achPhoto_display_div").val(display_image_name);
	
	navigator.camera.getPicture(onSuccessA, onFailA, { quality: 60,
	targetWidth: 350,
	destinationType: Camera.DestinationType.FILE_URI,correctOrientation: true});		
}

function onSuccessA(imageURI) {	
	var image = document.getElementById('myImageA_display');
    image.src = imageURI;
    var hidden_path="achPhoto_display_div";
	$("#"+hidden_path).val(imageURI);	
}

function onFailA(message) {
	$("#achPhoto_display_name").val("");
	imagePathA="";
    alert('Failed because: ' + message);
}

//---------------posm competitor
function getAchivementImage_posm() {
	var tempTime = $.now();
	posm_comp_image_name=tempTime.toString()+"_"+localStorage.selectedOutlet+"_posm_competitor.jpg";
	//alert(posm_comp_image_name);
	$("#achPhoto_posm_name").val(posm_comp_image_name);
	$("#achPhoto_posm_div").val(posm_comp_image_name);
	
	navigator.camera.getPicture(onSuccessB, onFailB, { quality: 60,
	targetWidth: 350,
	destinationType: Camera.DestinationType.FILE_URI,correctOrientation: true});		
}

function onSuccessB(imageURI) {
	var image = document.getElementById('myImageA_posm');
    image.src = imageURI;
    var hidden_path="achPhoto_posm_div";
	$("#"+hidden_path).val(imageURI);	
}

function onFailB(message) {
	$("#achPhoto_posm_name").val("");
	imagePathB="";
    alert('Failed because: ' + message);
}

//=======+++++++++++++++++++++++++++++++++++==========

var qpds_image_name='';
//QPDS  After
function get_pic_qpds(id) {
	
	//$('#qpdsdiv_'+id).find('input, textarea, button, select').attr('disabled','disabled');
	var div_id="qpdsSL_image_div_"+id;
	temp_image_div=div_id;
	//var hidden_name="qpdsSL_image_name_hidden_"+id;
	localStorage.hidden_name_qpds="qpdsSL_image_name_hidden_"+id;
	//alert(hidden_name);
	var tempTime = $.now();
	qpds_image_name=tempTime.toString()+"_"+localStorage.selectedOutlet+".jpg";	
	$("#"+localStorage.hidden_name_qpds).val(qpds_image_name);
	navigator.camera.getPicture(onSuccessQpds, onFailQpds, {  quality: 60,
		targetWidth: 350,
		destinationType: Camera.DestinationType.FILE_URI , correctOrientation: true});
}

function onSuccessQpds(imageURI) {
	var image = document.getElementById(temp_image_div);
    image.src = imageURI;
    var hidden_path=temp_image_div.replace("qpdsSL_image_div","qpdsSL_image_div_hidden");
	$("#"+hidden_path).val(imageURI);
	
}

function onFailQpds(message) {	
	$("#"+localStorage.hidden_name_qpds).val("");
	qpds_image_name='';
	temp_image_div='';
	imagePathA="";
    alert('Failed because: ' + message);
}

//===========Shop======
//Shop
function get_pic_shop() {
	var tempTime = $.now();
	shop_image_name=tempTime.toString()+"_"+localStorage.selectedOutlet+"_shop.jpg";
	$("#shop_image_name_hidden").val(shop_image_name);
	$("#shop_image_div_hidden").val(shop_image_name);
	navigator.camera.getPicture(onSuccessShop, onFailShop, { quality: 60,
		targetWidth: 350,
		destinationType: Camera.DestinationType.FILE_URI , correctOrientation: true });
}
function onSuccessShop(imageURI) {
	var image = document.getElementById('shop_image_div');
    image.src = imageURI;
    var hidden_path="shop_image_div_hidden";
	$("#"+hidden_path).val(imageURI);
}
function onFailShop(message) {
	$("#shop_image_name_hidden").val("");
	imagePathA="";
    alert('Failed because: ' + message);
}

//===========salfie======

function get_salfie() {
	var tempTime = $.now();
	salfie_image_name=tempTime.toString()+"_"+localStorage.selectedOutlet+"_salfie.jpg";
	$("#salfie_image_name_hidden").val(salfie_image_name);
	$("#salfie_image_div_hidden").val(salfie_image_name);
	navigator.camera.getPicture(onSuccessSalfie, onFailSalfie, { quality: 60,
		targetWidth: 350,
		destinationType: Camera.DestinationType.FILE_URI , correctOrientation: true });
}

function onSuccessSalfie(imageURI) {
	var image = document.getElementById('salfie_image_div');
    image.src = imageURI;
    var hidden_path="salfie_image_div_hidden";
	$("#"+hidden_path).val(imageURI);
}

function onFailSalfie(message) {
	imagePathA="";
    alert('Failed because: ' + message);
}


//===========unpaid======

function get_pic_unpaid_display() {
	var tempTime = $.now();
	unpaid_image_name=tempTime.toString()+"_"+localStorage.selectedOutlet+"_unpaid.jpg";
	$("#unpaid_image_name_hidden").val(unpaid_image_name);
	$("#unpaid_image_div_hidden").val(unpaid_image_name);
	navigator.camera.getPicture(onSuccessUnpaid, onFailUnpaid, { quality: 60,
		targetWidth: 350,
		destinationType: Camera.DestinationType.FILE_URI , correctOrientation: true });
}

function onSuccessUnpaid(imageURI) {
	var image = document.getElementById('unpaid_image_div');
    image.src = imageURI;
    var hidden_path="unpaid_image_div_hidden";
	$("#"+hidden_path).val(imageURI);
}

function onFailUnpaid(message) {
	imagePathA="";
    alert('Failed because: ' + message);
}

//=========== paid======


//=========== posm======

function get_pic_posm() {
	var tempTime = $.now();
	posm_image_name=tempTime.toString()+"_"+localStorage.selectedOutlet+"_posm.jpg";
	$("#posm_image_name_hidden").val(posm_image_name);
	$("#posm_image_div_hidden").val(posm_image_name);
	navigator.camera.getPicture(onSuccessPOSM, onFailPOSM, { quality: 60,
		targetWidth: 350,
		destinationType: Camera.DestinationType.FILE_URI , correctOrientation: true });
}

function onSuccessPOSM(imageURI) {
	var image = document.getElementById('posm_image_div');
    image.src = imageURI;
    var hidden_path="posm_image_div_hidden";
	$("#"+hidden_path).val(imageURI);
}

function onFailPOSM(message) {
	imagePathA="";
    alert('Failed because: ' + message);
}


//=========== competitor======

function get_pic_competitor() {
	var tempTime = $.now();
	competitor_image_name=tempTime.toString()+"_"+localStorage.selectedOutlet+"_competitor.jpg";
	$("#competitor_image_name_hidden").val(competitor_image_name);
	$("#competitor_image_div_hidden").val(competitor_image_name);
	navigator.camera.getPicture(onSuccessCompetitor, onFailCompetitor, { quality: 60,
		targetWidth: 350,
		destinationType: Camera.DestinationType.FILE_URI , correctOrientation: true });
}

function onSuccessCompetitor(imageURI) {
	var image = document.getElementById('competitor_image_div');
    image.src = imageURI;
    var hidden_path="competitor_image_div_hidden";
	$("#"+hidden_path).val(imageURI);
}

function onFailCompetitor(message) {
	imagePathA="";
    alert('Failed because: ' + message);
}

//=========== self======

function get_pic_self() {
	var tempTime = $.now();
	self_image_name=tempTime.toString()+"_"+localStorage.selectedOutlet+"_self.jpg";
	$("#self_image_name_hidden").val(self_image_name);
	$("#self_image_div_hidden").val(self_image_name);
	navigator.camera.getPicture(onSuccessSelf, onFailSelf, { quality: 60,
		targetWidth: 350,
		destinationType: Camera.DestinationType.FILE_URI , correctOrientation: true });
}

function onSuccessSelf(imageURI) {
	var image = document.getElementById('self_image_div');
    image.src = imageURI;
    var hidden_path="self_image_div_hidden";
	$("#"+hidden_path).val(imageURI);
}

function onFailSelf(message) {
	imagePathA="";
    alert('Failed because: ' + message);
}

//==================upload image===============


//------------------------------------------------------------------------

function upload_salfie(){
	//alert('upload salfie')
	localStorage.step_flag=1; 
	localStorage.salfiedataSubmit=1;
	//step_flag=2; //1 fd , 2 qpds, 3 gift
	file_upload_error = 0;
	//$( "#sub_qpds_button").hide();
		
	var image_name_salfie=$("#salfie_image_name_hidden").val();
	var salfie_image_path=$("#salfie_image_div_hidden").val();
	//alert(image_name_salfie);
	if (image_name_salfie.length >10){
			uploadPhoto(salfie_image_path, image_name_salfie);
			$("#submit_data").html("");
	} /*else {
			$("#submit_data").html("Salfie Image Not Available");
			
	}*/
	//upload_shop()
}


function upload_shop(){
	alert('upload shop')
	localStorage.step_flag=2;
	localStorage.shopdataSubmit=1;
	file_upload_error = 0;
	
	var image_name_shop=$("#shop_image_name_hidden").val();
	var shop_image_path=$("#shop_image_div_hidden").val();
	
	if (image_name_shop.length >10){
			uploadPhoto(shop_image_path, image_name_shop);
			$("#submit_data").html("");				
	}/* else {

		$("#submit_data").html("Shop Image Not Available");
		//$("#submit_data").html("");				

	}*/
}

function upload_qpds(){
	alert('upload Qpaid')
	//QPDS
	localStorage.step_flag=3; 
	file_upload_error = 0;
	//$( "#sub_qpds_button").hide();
	
	
	if (typeof localStorage.qpds_data_ready === "undefined") {
		localStorage.qpds_data_ready ="_";
	}
 	localStorage.qpdsdataSubmit=1;
	if (localStorage.qpds_data_ready.length > 10){
		
		for (var i=0; i < localStorage.qpdsSlabTotal-1; i++){
			var image_name=$("#qpdsSL_image_name_hidden_"+i.toString()).val();
			var qpds_image_path=$("#qpdsSL_image_div_hidden_"+i.toString()).val();
			
			
			var image_name_before=$("#qpdsSL_image_name_hidden_"+i.toString()+"_before").val();
			var qpds_image_path_before=$("#qpdsSL_image_div_hidden_"+i.toString()+"_before").val();
			localStorage.qpdsdataSubmit=1;
			if (qpds_image_path.length >10){
				uploadPhoto(qpds_image_path, image_name);
				$("#submit_data").html("");		
				
				}
				/*else{
					$("#submit_data").html("Promotion Image Not Available");				
				}*/
		}//end for
	}//end if
	else{
		 localStorage.qpdsdataSubmit=1;
	}
	buttonCheck();
	 //upload_display()
}



function upload_display(){
	localStorage.step_flag=4; 
	localStorage.displayDataSubmit=1;
	file_upload_error = 0;
	
	var image_name_display=$("#achPhoto_display_name").val();
	var display_image_path=$("#achPhoto_display_div").val();
	//alert(image_name_display+'-'+posm);
	if (image_name_display.length >10){
		uploadPhoto(display_image_path, image_name_display);
		$("#submit_data").html("");
	} /*else {
		$("#submit_data").html("Display Image Not Available");
	}*/
	//upload_posm_comp()	
}

function upload_posm_comp(){
	localStorage.step_flag=5; 
	localStorage.posmCompDataSubmit=1;
	file_upload_error = 0;

	var image_name_posm_comp=$("#achPhoto_posm_name").val();
	var posm_comp_image_path=$("#achPhoto_posm_div").val();
	//alert(image_name_posm_comp+'-'+posm);
	if (image_name_posm_comp.length >10){
		uploadPhoto(posm_comp_image_path, image_name_posm_comp);
		$("#submit_data").html("");
	} /*else {
		$("#submit_data").html("POSM Competitor Image Not Available");			

	}*/
	
}

function check_step() {
	//$("#image_up_button").hide();	
	//localStorage.step_flag=1;
	alert(localStorage.step_flag);
	if (localStorage.step_flag==0){
		upload_salfie();
		alert ('chk- salfie')
	}	
	
	if (localStorage.step_flag==1){
		alert ('chk- shop')
		upload_shop();
	}
	
	if (localStorage.step_flag==2){
		alert ('chk- paid')
		upload_qpds();
	}
	
	if (localStorage.step_flag==3){
		alert('display');
		upload_display();
	}
	
	if (localStorage.step_flag==4){
		alert('posm');
		upload_posm_comp();
	}

}

//		==========================Button check start==============
function buttonCheck(){	
	
	if ((localStorage.latlongSubmit==0)&& (localStorage.dataSubmit==0) && (localStorage.shopdataSubmit==0) && (localStorage.qpdsdataSubmit==0)){
		$("#location_button").show();
		$("#sub_button_div").hide();
		$("#image_up_button").hide();
		$("#NOutlet_button").hide();		
				
		//alert ('s-1');
	
	}
	
	if ((localStorage.latlongSubmit==1) && (localStorage.dataSubmit==0) && (localStorage.shopdataSubmit==0) && (localStorage.qpdsdataSubmit==0)){
		$("#location_button").hide();
		$("#sub_button_div").hide();
		$("#image_up_button").show();
		$("#NOutlet_button").hide();
		//alert ('s-2');	
	}
	
	if ((localStorage.latlongSubmit==1) && (localStorage.dataSubmit==0) && (localStorage.shopdataSubmit==1) && (localStorage.qpdsdataSubmit==1)){
		
		$("#location_button").hide();
		submit_data()
		$("#sub_button_div").show();
		$("#image_up_button").hide();
		$("#NOutlet_button").hide();
		//alert ('s-2');	
	}
	
	if ((localStorage.latlongSubmit==1) && (localStorage.dataSubmit==1) && (localStorage.shopdataSubmit==1) && (localStorage.qpdsdataSubmit==1)){
	
		$("#location_button").hide();
		$("#sub_button_div").hide();

		$("#image_up_button").hide();
		$("#NOutlet_button").show();
		//alert ('s-7');
		$("#submit_data_check").html("Successfully Submitted");		
		$("#submit_data").html("");
	
	}	

}


//-------------------------------------------------------------------------

//File upload \
function uploadPhoto(imageURI, imageName) {
 
  var options = new FileUploadOptions();
  options.fileKey="upload";
//  options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
  options.fileName=imageName;
//	options.fileName = options.fileName
  options.mimeType="image/jpeg";

  var params = {};
  params.value1 = "test";
  params.value2 = "param";
  options.params = params;
  
  options.chunkedMode = false;

  var ft = new FileTransfer();
 ft.upload(imageURI, encodeURI("http://i001.yeapps.com/image_hub/marico_audit/upload_image/"),win,fail,options);
}

function win(r) {
	file_upload_error = 0;
	
	if (localStorage.step_flag==1){  
		if (localStorage.attendanceFlag==1){	// Faisal #if condition	
			$("#submit_data").html("salfie Sync Completted");
			localStorage.step_flag=1;
			alert('step_flag 1');
			localStorage.salfiedataSubmit=1;
			var url = "#routePage";
			$.mobile.navigate(url);	
			$('#routePage').trigger('create');
		}else{
			//$("#submit_data").html("salfie Sync Completted");
			localStorage.step_flag=1;
			localStorage.salfiedataSubmit=1;
			var url = "#menuPage";
			$.mobile.navigate(url);	
			$('#menuPage').trigger('create');
		}		
	}else{
								
		if (localStorage.step_flag==1){  // Shop
			alert('win-1')
			$("#submit_data").html("Shop Sync Completted");
			localStorage.shopdataSubmit=1;
			upload_shop();
			buttonCheck();
		}
		
		if (localStorage.step_flag==2){  // Paid
			alert('win-2')
			$("#submit_data").html("Paid Display Sync Completted");
			localStorage.qpdsdataSubmit=1;
			upload_qpds();
			buttonCheck();
		}
		
		if (localStorage.step_flag==3){  // Display
			alert('win-3')
			$("#submit_data").html("Display Upload Completted");
			localStorage.displayDataSubmit=1;
			upload_display();
			buttonCheck();
		}
		if (localStorage.step_flag==4){  // Display
			alert('win-4')
			$("#submit_data").html("POSM Competitor Upload Completted");
			localStorage.posmCompDataSubmit=1;
			upload_posm_comp();
			buttonCheck();
		}
		
		localStorage.step_flag=1; //Reset step flag 
	}
	
}

function fail(error) {
	file_upload_error = 1;
	//alert('fail');
//	step_flag=0; //1 fd , 2 qpds, 3 gift
	
	if (step_flag==1){  // salfie
		//alert('Fail- 1')
		$("#submit_data").html("Network timeout. Please ensure you have good network signal and working Internet.");
		localStorage.salfiedataSubmit=0;
		buttonCheck();
	}
	if (step_flag==2){  // Shop
		//alert('Fail- 2')
		$("#submit_data").html("Network timeout. Please ensure you have good network signal and working Internet.");
		localStorage.shopdataSubmit=0;
		buttonCheck();
	}
	
	if (step_flag==3){ // QPDS
		//alert('Fail- 3')
		$("#submit_data").html("Network timeout. Please ensure you have good network signal and working Internet.");
		localStorage.qpdsdataSubmit=0;
		buttonCheck();
	}
	
	if (step_flag==4){ // Display
		$("#submit_data").html("Network timeout. Please ensure you have good network signal and working Internet.");
		localStorage.displayDataSubmit=0;
		buttonCheck();
	}
	if (step_flag==5){ // POSM Competitor
		$("#submit_data").html("Network timeout. Please ensure you have good network signal and working Internet.");
		localStorage.posmCompDataSubmit=0;
		buttonCheck();
	}
	
	step_flag=0; //Reset step flag
}


//=====================Dialog==========================

//============wait for data submit  

function doTimer()
{
  setTimeout(setSubmitmsg(),60000);
 
}
function setSubmitmsg(){
	$("#submit_data").html("Successfully Submitted");
	
}
function setOutlet(){
	//$("#outletButton").show();
	localStorage.syncinfo='<div  style="color:#006A6A; font-size:18px;" id="outletName_show">'+localStorage.outletNameID +'</div>Sync Completed Successfully';
	$('#outletSyncmsg').html(localStorage.syncinfo);
	$("#outletOk").show();
}


//=============qty faceup check fdisplay====

function checkQtyFd(i){
	var get_i= i.toString();
	var get_i_list=get_i.split("_")
	
	
	
	var slab=get_i_list[0].replace("/","")
	var id=get_i_list[1].replace("/","")
	//alert (slab)
	//alert (id)
	var qty=$("#ItemQtyfdisplay_"+slab.toString()+"_"+id.toString()).val();
	var faceup=$("#ItemFaceupfdisplay_"+slab.toString()+"_"+id.toString()).val();
	
	//alert (qty)
	//alert (faceup)
	if (parseInt(faceup) > parseInt(qty)){
		//alert (slab.toString())
		$("#ItemFaceupfdisplay_"+slab.toString()+"_"+id.toString()).val("");
	}
}


function checkQtyQpds(i){
	var get_i= i.toString();
	var get_i_list=get_i.split("_")
	
	
	
	var slab=get_i_list[0].replace("/","")
	var id=get_i_list[1].replace("/","")
	
	var qty=$("#ItemQtyqpds_"+slab.toString()+"_"+id.toString()).val();
	var faceup=$("#ItemFaceupqpds_"+slab.toString()+"_"+id.toString()).val();
	
	if (parseInt(faceup) > parseInt(qty)){
		$("#ItemFaceupqpds_"+slab.toString()+"_"+id.toString()).val("");
	}
}

/*function checkCompQty(i){
	var id= i.toString();
	
	var comQty=$("#comQty_"+id.toString()).val();
	var comTp=$("#comTp_"+id.toString()).val();
	var comMrp=$("#comMrp_"+id.toString()).val();
	alert(comQty+'-'+comTp+'-'+comMrp);
}*/




/*function buttonCheck(){	
	
	if (localStorage.latlongSubmit==0){
		$("#location_button").show();
		$("#sub_button_div").hide();
		
		$("#image_up_button").hide();
		$("#NOutlet_button").hide();		
				
		//alert ('s-L');
	
	}
	
	if (localStorage.dataSubmit==0){
		$("#location_button").hide();
		$("#sub_button_div").show();
		
		$("#image_up_button").hide();
		$("#NOutlet_button").hide();
		//alert ('s-0');
		
	}
	
	if ((localStorage.latlongSubmit==1)&& (localStorage.dataSubmit==1) && ((localStorage.shopdataSubmit==0) || (localStorage.qpdsdataSubmit==0))){
		$("#location_button").hide();
		$("#sub_button_div").show();
		
		$("#image_up_button").hide();
		$("#NOutlet_button").hide();		
				
		//alert ('s-1');
	
	}
	
	if ((localStorage.latlongSubmit==1) && (localStorage.dataSubmit==1) && ((localStorage.shopdataSubmit==1) || (localStorage.qpdsdataSubmit==0))){
		$("#location_button").hide();
		$("#sub_button_div").hide();

		$("#image_up_button").show();
		$("#NOutlet_button").hide();
		//alert ('s-2');	
	}
	
	if ((localStorage.latlongSubmit==1) && (localStorage.dataSubmit==1) && ((localStorage.shopdataSubmit==1) || (localStorage.qpdsdataSubmit==1))){
	
		$("#location_button").hide();
		$("#sub_button_div").hide();

		$("#image_up_button").hide();
		$("#NOutlet_button").show();
		//alert ('s-7');
		$("#submit_data_check").html("Successfully Submitted");		
		$("#submit_data").html("");
	
	}	

}*/

function menupage(){
	
	var check_outlet= localStorage.outletString;
								//alert ('<input type="radio" name="RadioOutlet" value="'+localStorage.selectedOutlet+'rdrd'+localStorage.selected_date_get+'">')
	localStorage.outletString=check_outlet.replace('<input type="radio" name="RadioOutlet" value="'+localStorage.selectedOutlet+'rdrd'+localStorage.selected_date_get+'">','<input type="radio" name="RadioOutlet" value="'+localStorage.selectedOutlet+'rdrd'+localStorage.selected_date_get+'" disabled="True">');
	cancel_outlet();
	var url = "#outletPage";
	$.mobile.navigate(url);
	location.reload();
	
}



function munu_page_check(){
	$(".errMsg").html('');
	//alert('menu check');
	var sync_date_get=get_date();
	//var sync_date=sync_date_get.split(' ')[0];
	var sync_y=sync_date_get.split('-')[0];
	var sync_m=sync_date_get.split('-')[1];
	if (sync_m.length==1){sync_m='0'+sync_m}
	var sync_d=sync_date_get.split('-')[2].split(' ')[0];
	if (sync_d.length==1){sync_d='0'+sync_d}
	var sync_date=sync_y +'-'+ sync_m +'-'+sync_d;
	//localStorage.sync_date="2015-1204"
	//alert (localStorage.sync_date)
	//alert (sync_date)
	if ((localStorage.synced=='YES') & (localStorage.sync_date!=sync_date)){
					//alert (localStorage.sync_date);
					cancel_outlet();
					
					localStorage.show_cancel=0;
								
					localStorage.m_new_string="";
					localStorage.m_new="";
					localStorage.selectedOutlet="";
					localStorage.outletExStringShow="";
					localStorage.outletException="";
					localStorage.outletChanne="";
					localStorage.outletNameID="";
					localStorage.mhskusTotal="";
					
					localStorage.npdTotal="";
					localStorage.fdisplaySlabTotal="";
					localStorage.fdisplayTotal="";
					localStorage.qpdsSlabTotal="";
					
					localStorage.qpdsTotal="";
					localStorage.giftTotal="";
					localStorage.marchadizingTotal="";
					localStorage.mhskus_data_ready="";
					localStorage.npd_data_ready="";
					localStorage.fdisplay_data_ready="";
					localStorage.qpds_data_ready="";
					localStorage.gift_data_ready="";
					localStorage.mar_data_ready="";
					
					//localStorage.sync_date=sync_date;
					//localStorage.synced=='YES';
					
					
					//distributon
					localStorage.mar_distrib_data=""
					localStorage.merchandisingDistribStr=""
					localStorage.mar_distrib_stock=""
					
					
					//alert (localStorage.sync_date)
					//check_route();
					var url = "#login";
					$.mobile.navigate(url);
					
				//	location.reload()
				}
		else{
			check_route();
			//var url = "#menuPage";
			var url = "#outletPage";
			$.mobile.navigate(url);
		}
}