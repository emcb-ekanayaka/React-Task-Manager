
window.onload = function () {
    getrequest();
    cmbcutomertype.addEventListener("change", cmbcutomertypeCH); // customer filter eka (whole select or rental)
    valid = "2px solid #28a745";
    invalid = "2px solid #dc3545";
    initial = "1px solid #6c757d";
    initialphase = "0%";
    firstphase = "15%";
    secoundphase = "30%";
    thirdphase = "45%";
    forthphase = "60%";
    fifthphase = "75%";
    sixthphase = "100%";

    customertypes = httpRequest("../customertype/list", "GET");
    customers = httpRequest("../customer/list", "GET");
    corders = httpRequest("../customerorder/list", "GET");


    // console.log(session.getObject("loginuser"));
	if(session.getObject("loginuser") != null){
        loggedUserName = session.getObject("loginuser").loginusername;
        loggedUser = httpRequest("/user/getuser/"+loggedUserName , "GET" );
        session.setObject('activeuser', loggedUser);

        console.log(loggedUser);
        if(loggedUser.employeeId != undefined){
            if(loggedUser.employeeId.photo != null) {
                profileImage.src = atob(loggedUser.employeeId.photo);
            }
            else{
                profileImage.src = 'resources/image/nouser.jpg';
            }
            lblLogUser.innerHTML = loggedUser.userName;
            loadchangepassword();
            //spnDesignation.innerHTML = loggedUser.employeeId.designationId.name;
        }else {
            window.location.href = "http://localhost:8080/login";
        }
    }else
		 window.location.href = "http://localhost:8080/login";



    $('#dismiss, .overlay').on('click', function () {
        $('#sidebar').removeClass('active');
        $('.overlay').removeClass('active');
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').addClass('active');
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
    $('.js-example-basic-single').select2();
    loadform();
    disablemodifi();
}
function disablemodifi(){

    console.log("B")
    if (session.getObject("activeuser").employeeId.designationId.name != "Owner"){
        notifi.style.display = "none";
        console.log("A")
    }
}



function loadform(){
    cmbcutomertype.style.border = initial;
    cmbcustomer.disabled = true;
    cmbcustomerorder.disabled = true;
    windowcorder = new Object();
    oldwindowcorder = null;
    myBar.style.width = initialphase;
    productdetail.disabled = true;

    fillCombo(cmbcutomertype, "Select Customer Type", customertypes, "name", "");
    fillCombo3(cmbcustomer, "Select Customer", customers, "regno", "");
    fillCombo(cmbcustomerorder, "Select Order", corders, "cordercode", "");
    clearinnerhtml();
}

function clearinnerhtml(){
    corderdate.innerHTML="";
    paiddate.innerHTML="";
    paidtime.innerHTML="";
    productionDate.innerHTML="";
    productionConfirmDate.innerHTML="";
    dailyproductaddeddate.innerHTML = "";

    productdetails.disabled = true;

    myBar.innerHTML = 0+"\n%";
    myBar.style.width = initialphase;

}

function cmbcutomertypeCH(){
    productdetail.disabled = true;
    cotomerbycutomertype=[];
    cmbcustomer.disabled = false;
    cmbcustomerorder.disabled = true;
    cotomerbycutomertype = httpRequest("/customer/listbyCustomertype?customertypeid=" + JSON.parse(cmbcutomertype.value).id, "GET" );
    if (windowcorder.customertype_id.name == "Whole"){
        fillCombo3(cmbcustomer, "Select Customer", cotomerbycutomertype, "regno", "companyname", "");

    }else{
        fillCombo3(cmbcustomer, "Select Customer", cotomerbycutomertype, "regno", "fname", "");

    }
    $("#customerselect2parent .select2-container").css('border',initial);
    $("#windowcustomerselect2parent .select2-container").css('border',initial);
    $("#windowcustomerorderpayselect2parent .select2-container").css('border',initial);
    fillCombo(cmbcustomerorder, "Select Order", corders, "cordercode", "");

    fullname.innerHTML = "";
    nicnumber.innerHTML = "";
    clearinnerhtml();

}

function cmbcustomerCH(){
    productdetail.disabled = true;
    cmbcustomerorder.disabled=false;
    fullname.innerHTML = "";
    nicnumber.innerHTML = "";
    if (windowcorder.customertype_id.name == "Rental"){

        var firstname = JSON.parse(cmbcustomer.value).fname;
        var lastname = JSON.parse(cmbcustomer.value).lname;
        var nic = JSON.parse(cmbcustomer.value).nic;
        fullname.innerHTML ="Full Name - " +firstname +" "+ lastname;
        nicnumber.innerHTML =" NIC - " +nic;

        $("#cityselect2parent .select2-container").css('border',valid);
    }
    $("#windowcustomerorderpayselect2parent .select2-container").css('border',initial);

    customerorderlistbycustomer = httpRequest("/customerorder/listbycustomertowindow?customerid=" + JSON.parse(cmbcustomer.value).id , "GET");
    fillCombo(cmbcustomerorder, "Select Order", customerorderlistbycustomer, "cordercode", "");
    clearinnerhtml();
}

function cmbcustomerorderCH(){
    productdetail.disabled = false;
    corderdate.innerHTML="-";
    paiddate.innerHTML="-";
    paidtime.innerHTML="-";
    productionDate.innerHTML="-";
    productionConfirmDate.innerHTML="-";
    dailyproductaddeddate.innerHTML = "-";

    corderdate.innerHTML = JSON.parse(cmbcustomerorder.value).addeddate;
    customerorderlistbycustomer = httpRequest("/customerpayment/listbycustomerpayment?customerorderid=" + JSON.parse(cmbcustomerorder.value).id , "GET");
    myBar.innerHTML = 15+"\n%";
    myBar.style.width = firstphase;

    if (customerorderlistbycustomer != null && customerorderlistbycustomer.paiddatetime!=undefined){

        var paypaiddate = customerorderlistbycustomer.paiddatetime;
        console.log(paypaiddate)
        paiddate.innerHTML = paypaiddate.substring(0,10);
        paidtime.innerHTML = paypaiddate.substring(11);

        myBar.innerHTML = 30+"\n%";
        myBar.style.width = secoundphase;
    }

    productdetailsforcustomer = httpRequest("/productionorder/productiondetails?newcustomerorderid=" + JSON.parse(cmbcustomerorder.value).id , "GET");

    if (productdetailsforcustomer != "" && productdetailsforcustomer.addeddate != "" ){
        productionDate.innerHTML = productdetailsforcustomer.addeddate;

        myBar.innerHTML = 45+"\n%";
        myBar.style.width = thirdphase;
    }
    if (productdetailsforcustomer != "" && productdetailsforcustomer.confirmdate !=undefined){
        productionConfirmDate.innerHTML = productdetailsforcustomer.confirmdate;

        myBar.innerHTML = 70+"\n%";
        myBar.style.width = fifthphase;
    }

    if (productdetailsforcustomer.productionorderHasProductList != undefined && productdetailsforcustomer.id != undefined){
        dailyproductdetails = httpRequest("/daliyproduct/byproduct?productionorderid=" +productdetailsforcustomer.id+"&productid="+productdetailsforcustomer.productionorderHasProductList[0].product_id.id, "GET");
        if (dailyproductdetails != "" && dailyproductdetails.addeddate!= ""){
            dailyproductaddeddate.innerHTML = dailyproductdetails.addeddate;

            myBar.innerHTML = 100+"\n%";
            myBar.style.width = sixthphase;
        }
    }



}

function productdetails(){
    customerproductdetails =[];
    $('#viewmodal').modal('show');
    customerproductdetails = httpRequest("/customerhasproduct/listbyproduct?customerid=" + JSON.parse(cmbcustomerorder.value).id , "GET");
    console.log(customerproductdetails)
    if (customerproductdetails.length != 0){
        fillInnerTable("tblPrintInnerCustomerorder", customerproductdetails, fillInnerForm, btnInnerDeleteMC, viewInnerOrderProduct);
    }
}

function notification(){
    $('#notificationmodel').modal('show');

}
function fillInnerForm (){}
function btnInnerDeleteMC (){}
function viewInnerOrderProduct (){}

function btnSignoutMC() {
    swal({
        title: "Do you want to sign out?",
        text: " ",
        icon: "warning",
        buttons: true,
        closeOnClickOutside: false
    }).then((willDelete) => {
        if (willDelete) {
            swal({
                title: "Sign Out Successful",
                text: " ",
                icon: "success",
                timer: 1500,
                buttons: false,
                closeOnClickOutside: false
            }).then(() => {
                window.location.assign('/logout');
            });

        }
    });
}

function loadchangepassword() {
    changePassword = new Object();
    oldChangePassword = null;

    changePassword.username = session.getObject('activeuser').userName;

    txtUsernameView.innerHTML = changePassword.username;
    txtCurrentPassword.value = "";
    txtNewPassword.value = "";
    txtConfirmPassword.value = "";
}

function getErrors() {
    var errors = "";

    if (txtCurrentPassword.value == "") {
        errors = errors + "\n" + "Current password is not entered";
        txtCurrentPassword.style.border = invalid;
    }

    if (txtNewPassword.value == "") {
        errors = errors + "\n" + "New password is not entered";
        txtNewPassword.style.border = invalid;
    }

    if (txtConfirmPassword.value == 0) {
        errors = errors + "\n" + "Confirm password is not entered";
        txtConfirmPassword.style.border = invalid;
    }

    return errors;
}

function btnSaveChangePasswordMC() {
    var errors = getErrors();
    if (errors == "") {
        swal({
            title: "Are you sure to change password of following user?",
            text: "Username : " + changePassword.username,
            icon: "warning",
            buttons: true,
            closeOnClickOutside: false
        }).then((willDelete) => {
            if (willDelete) {
               // var response = httpRequest("/changepassword", "POST", changePassword);
                var response = "0";
                if (response == "0") {
                    swal({
                        title: "Saved Successfully",
                        text: " System Going to Logout",
                        icon: "success",
                        timer: 1500,
                        buttons: false,
                        closeOnClickOutside: false
                    }).then(() => {

                        window.location.assign('/logout');
                    });
                } else {
                    swal({
                        title: "Failed to change password",
                        text: "Response - " + response,
                        icon: "error",
                        closeOnClickOutside: false
                    });
                }
            }
        });
    } else {
        // Error Message - Invalid Data or Empty Fields
        swal({
            title: "Failed to add",
            text: "Please fill in all required fields with valid data",
            icon: "error",
            closeOnClickOutside: false
        });
    }
}
