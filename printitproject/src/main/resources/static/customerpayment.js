window.addEventListener("load", initialize);

//Initializing Functions


function initialize() {
    $('[data-toggle="tooltip"]').tooltip()

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);

    $('.js-example-basic-single').select2();

    txtSearchName.addEventListener("keyup", btnSearchMC);

    cmbpaymethod.addEventListener("change", cmbpaymethodCH);
    //cmbcustomer.addEventListener("change", cmbcustomerCH);
    //cmbcustomerorder.addEventListener("change", cmbcustomerorderCH);
    cmbpaytype.addEventListener("change", cmbpaytypeCH);
    txtpaidamount.addEventListener("keyup", txtpaidamountCH);
    cmbpaymethod.addEventListener("change", cmbpaymethodCH);

    privilages = httpRequest("../privilage?module=CUSTOMERPAYMENT", "GET");

    customers = httpRequest("../customer/list", "GET");
   /* corders = httpRequest("../customerorder/listbycustomer", "GET");*/
    paymenttypes = httpRequest("../paymenttype/list", "GET");
    paymethods = httpRequest("../supplierpaymethod/list", "GET");
    customerpaystatuses = httpRequest("../customerpaystatus/list", "GET");
    employees = httpRequest("../employee/list", "GET");

    valid = "2px solid green";
    invalid = "2px solid red";
    initial = "2px solid #d6d6c2";
    updated = "2px solid #ff9900";
    active = "#ff9900";

    loadView();
    loadForm();
    changeTab('form');
}

function loadView() {

    //Search Area
    txtSearchName.value = "";
    txtSearchName.style.background = "";

    //Table Area
    activerowno = "";
    activepage = 1;
    var query = "&searchtext=";
    loadTable(1, cmbPageSize.value, query);
}

function loadTable(page, size, query) {
    page = page - 1;
    customerpayments = new Array();
    var data = httpRequest("/customerpayment/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) customerpayments = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblCustomerPayment', customerpayments, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblCustomerPayment);

    if (activerowno != "") selectRow(tblCustomerPayment, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldcustomerpayment == null) {
        paginate = true;
    } else {
        if (getErrors() == '' && getUpdates() == '') {
            paginate = true;
        } else {
            paginate = window.confirm("Form has Some Errors or Update Values. " +
                "Are you sure to discard that changes ?");
        }
    }
    if (paginate) {
        activepage = page;
        activerowno = ""
        loadForm();
        loadSearchedTable();
    }

}

function viewitem(cuspay, rowno) {

        viewcustomerpayment = JSON.parse(JSON.stringify(cuspay));
        productinvoicedetails = httpRequest("customerorderhasproduct/listofproductforinvoice?customerorderid= "+ viewcustomerpayment.corder_id.id, "GET");
        fillTable("tblproductdetailinvoice", productinvoicedetails, false, false, false);

        tblBillnumber.innerHTML = viewcustomerpayment.bilno;
        tblCustomer.innerHTML = viewcustomerpayment.customer_id.regno;
        tblAddeddate.innerHTML = viewcustomerpayment.paiddatetime.substring(0,10);
        tblAddedTime.innerHTML = viewcustomerpayment.paiddatetime.substring(11);
        tblCustomerOrder.innerHTML = viewcustomerpayment.corder_id.cordercode;
        tblOrderamount.innerHTML = parseFloat(viewcustomerpayment.orderamount).toFixed(2);
        tblPaytype.innerHTML = viewcustomerpayment.paymenttype_id.name;
        tblPaymethod.innerHTML = viewcustomerpayment.paymethod_id.name;
        tblTotalamount.innerHTML = parseFloat(viewcustomerpayment.totalamount).toFixed(2);
        tblPaidamount.innerHTML = parseFloat(viewcustomerpayment.paidamount).toFixed(2);
        tblBalanceamount.innerHTML = parseFloat(viewcustomerpayment.balanceamount).toFixed(2);
        tblCustomerBalanceamount.innerHTML = parseFloat(viewcustomerpayment.customerbalaceamount).toFixed(2);

        customerName.innerHTML = "";
        customercontact.innerHTML = "";
        customeraddress.innerHTML = "";

        if (viewcustomerpayment.customer_id.customertype_id.name == "Rental"){
            var firstName = viewcustomerpayment.customer_id.fname;
            var lastName = viewcustomerpayment.customer_id.lname;
            customerName.innerHTML = firstName + " " + lastName;
            customercontact.innerHTML = viewcustomerpayment.customer_id.mobile;
            customeraddress.innerHTML = viewcustomerpayment.customer_id.address;
            customercity.innerHTML = viewcustomerpayment.customer_id.cities_id.name;
        }if (viewcustomerpayment.customer_id.customertype_id.name == "Whole"){
            customerName.innerHTML = viewcustomerpayment.customer_id.companyname;
            customercontact.innerHTML = viewcustomerpayment.customer_id.cpmobile;
            customeraddress.innerHTML = viewcustomerpayment.customer_id.address;
            customercity.innerHTML = viewcustomerpayment.customer_id.cities_id.name;
        }
        for (var index in productinvoicedetails){
            cpname.innerHTML = productinvoicedetails[index].cpname;
            cpmobile.innerHTML = productinvoicedetails[index].cpmobile;
            toddress.innerHTML = productinvoicedetails[index].address;
            toCity.innerHTML = productinvoicedetails[index].cities_id.name;
        }
        $('#viewmodal').modal('show')
    console.log(productinvoicedetails);

}

function btnPrintrow() {

    var format = invoice.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'></head>" +
        "<div>" +
        "<body><div style='margin-top: 10px'><h1></h1></div>" +
        "<div>" + format + "</div>" +
        "<script>invoice</script>" +
        "</body></div> " +
        "</html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);

}

function loadForm() {
    customerpayment = new Object();
    oldcustomerpayment = null;

    //fillcombo (feild id , message, objectlist, propertiess, value);

    fillCombo(cmbcustomer, "Select Customer", customers, "regno", "");
    /*fillCombo(cmbcustomerorder, "Select Order", corders, "cordercode", "");*/
    cmbcustomerorder.disabled = true;
    fillCombo(cmbpaytype, "Select Pay Type", paymenttypes, "name", "");
    fillCombo(cmbpaymethod, "Select Pay Method", paymethods, "name", "");
    fillCombo(cmbStatus, "Select Status", customerpaystatuses, "name", "Paid");
    customerpayment.cpaystatus_id = JSON.parse(cmbStatus.value);
    cmbStatus.disabled = true;
    fillCombo(cmbEmployee, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    customerpayment.employee_id = JSON.parse(cmbEmployee.value);
    cmbEmployee.disabled = true;

    cmbaddeddate.value = getCurrentDateTime("datetime");
    customerpayment.paiddatetime = cmbaddeddate.value;
    cmbaddeddate.disabled = true;
    cmbaddeddate.style.border = valid;

    // Get Next Number Form Data Base
    var nextNumber = httpRequest("/customerpayment/nextnumber", "GET");
    txtbillnumber.value = nextNumber.bilno;
    customerpayment.bilno = txtbillnumber.value;
    txtbillnumber.disabled="disabled";
    txtbillnumber.style.border = valid;

    cmbcustomer.value = "";
    cmbcustomerorder.value = "";
    txtCustomerBalanceAmount.value = "";
    txtorderamount.value = "";
    cmbpaytype.value = "";
    cmbpaymethod.value = "";
    txttotalamount.value = "";
    txtpaidamount.value = "";
    txtbalanceamount.value = "";

    setStyle(initial);
    cmbEmployee.style.border = valid;
    disablepaymetdetails();
    disableButtons();
    txttotalamount.disabled = true;
    txtCustomerBalanceAmount.disabled = true;
    txtorderamount.disabled = true;
    txtbalanceamount.disabled = true;
}

function cmbcustomerCH(){
    customerorderlistbycustomer = httpRequest("/customerorder/listbycustomer?customerid=" + JSON.parse(cmbcustomer.value).id , "GET");
    fillCombo(cmbcustomerorder, "Select Order", customerorderlistbycustomer, "cordercode", "");
    cmbcustomerorder.disabled = false;
    $("#customerorderpayselect2parent .select2-container").css('border',initial);

    cmbcustomerorder.value ="";
    txtorderamount.value ="";
    txttotalamount.value ="";
    txtbalanceamount.value = "";
    txtpaidamount.value = "";

    customerpayment.orderamount = null;
    customerpayment.totalamount = null;
    customerpayment.corder_id = null;
    customerpayment.balanceamount = null;
    customerpayment.paidamount = null;

    txtorderamount.style.border = initial;
    txttotalamount.style.border = initial;
    txtbalanceamount.style.border = initial;
    txtpaidamount.style.border = initial;

    cmbpaytype.disabled = false;
    cmbpaytype.style.border = initial;
    fillCombo(cmbpaytype, "Select Pay Type", paymenttypes, "name", "");

}

function cmbcustomerorderCH(){
    customerorderlistbycustomer = JSON.parse(cmbcustomerorder.value);
    txtorderamount.value =  parseFloat(customerorderlistbycustomer.nettotal).toFixed(2);
    customerpayment.orderamount = txtorderamount.value;
    txtorderamount.style.border = valid;

    cordernettotal =  parseFloat(customerorderlistbycustomer.nettotal).toFixed(2);
    corderpaidamount =  parseFloat(customerorderlistbycustomer.paidamount).toFixed(2);
    total = cordernettotal - corderpaidamount;
    txttotalamount.value = parseFloat(total).toFixed(2);
    customerpayment.totalamount = txttotalamount.value;
    txttotalamount.style.border = valid;

    txtbalanceamount.style.border = initial;
    txtbalanceamount.value = "";
    customerpayment.balanceamount = null;

    txtpaidamount.style.border = initial;
    txtpaidamount.value = "";
    customerpayment.paidamount = null;

    txtpaidamount.disabled = false;
    cmbpaytype.disabled = false;
    cmbpaytype.value = "";
    cmbpaytype.style.border = initial;
    customerpayment.paymenttype_id = null;

    txtCustomerBalanceAmount.value = toDecimal("0");
    customerpayment.customerbalaceamount =  txtCustomerBalanceAmount.value;
    txtCustomerBalanceAmount.style.border = valid;

    // If there is a advance value in the customer order pay-type will be advance and paid amount will come to the paid amount of the customer-payment
    adamountofcorder =  parseFloat(customerorderlistbycustomer.advaceamount).toFixed(2);
    if (adamountofcorder != 0.00){
        fillCombo(cmbpaytype, "Select Pay Type", paymenttypes, "name", "Advance-Payment");
        cmbpaytype.style.border = valid;
        customerpayment.paymenttype_id = JSON.parse(cmbpaytype.value);

        txtpaidamount.style.border = valid;
        txtpaidamount.value = parseFloat(adamountofcorder).toFixed(2);
        customerpayment.paidamount = txtpaidamount.value;
        txtpaidamountCH();
    }else {
        fillCombo(cmbpaytype, "Select Pay Type", paymenttypes, "name", "Balance-Payment");
        cmbpaytype.style.border = valid;
        customerpayment.paymenttype_id = JSON.parse(cmbpaytype.value);
    }
}

function cmbpaytypeCH(){
    if (customerpayment.paymenttype_id.name == "Full-Payment"){
        txtpaidamount.value = txttotalamount.value;
        txtpaidamount.style.border = valid;
        txtpaidamount.disabled = true;
        customerpayment.paidamount = txtpaidamount.value;
        txtpaidamountCH()
    }else {
        txtpaidamount.value="";
        txtpaidamount.style.border = initial;
        customerpayment.paidamount = null;
        txtpaidamount.disabled = false;

        txtbalanceamount.value = "";
        txtbalanceamount.style.border = initial;
        customerpayment.balanceamount = null;
    }
}

function txtpaidamountCH(){

    if (txtpaidamount.value != ""){
        if (parseFloat(txtpaidamount.value) > parseFloat(txttotalamount.value) || parseFloat(customerpayment.paidamount) > parseFloat(customerpayment.totalamount)){
            customerpaybalanace = customerpayment.paidamount - customerpayment.totalamount;
            txtCustomerBalanceAmount.value = parseFloat(customerpaybalanace).toFixed(2)
            txtCustomerBalanceAmount.style.border = valid;
            customerpayment.customerbalaceamount = txtCustomerBalanceAmount.value;

            txtbalanceamount.value = toDecimal("0");
            customerpayment.balanceamount =  txtbalanceamount.value;
            txtbalanceamount.style.border = valid;
        }else {
            balanace =  customerpayment.totalamount - customerpayment.paidamount;
            txtbalanceamount.value = parseFloat(balanace).toFixed(2)
            txtbalanceamount.style.border = valid;
            customerpayment.balanceamount = txtbalanceamount.value;

        }

    }else {
        swal({
            title: "Paid Amount is Empty...!",
            icon: "error",
            button: true,});

        txtbalanceamount.style.border = initial;
        txtbalanceamount.value = "";
        customerpayment.balanceamount = null;

        txtCustomerBalanceAmount.style.border = initial;
        txtCustomerBalanceAmount.value = "";
        customerpayment.customerbalaceamount = null;

    }


}

function  cmbpaymethodCH(){
    if (customerpayment.paymethod_id.name =="Cash Payment"){
        disablepaymetdetails();
        console.log("Cash Payment")
    }
    if (customerpayment.paymethod_id.name =="Cheque"){
       chequecollaps();
    }
    if (customerpayment.paymethod_id.name =="Bank Payment"){
       bankpaymentcollaps();
        console.log("Bank payment")
    }
    if (customerpayment.paymethod_id.name =="Transfer"){
        transfercollaps();

    }
}

//
function disablepaymetdetails(){

    $('#collapseThree').collapse("hide")
    $('#collapseOne').collapse("hide")
    $('#collapseTwo').collapse("hide")
    txtchequenumber.value = "";
    txtchequedate.value = "";
    txtbankaccname.value = "";
    txtbankaccno.value = "";
    txtbankname.value = "";
    txttransbankbranchname.value = "";
    txttransferid.value = "";
    txttransferdatetime.value = "";

    customerpayment.chequeno = null;
    customerpayment.chequedate = null;
    customerpayment.bankacountname = null;
    customerpayment.bankaccno = null;
    customerpayment.bankname = null;
    customerpayment.bankbranchname = null;
    customerpayment.transferid = null;
    customerpayment.transferdatetime = null;

    txtchequenumber.disabled = true;
    txtchequedate.disabled = true;
    txtbankaccname.disabled = true;
    txtbankaccno.disabled = true;
    txtbankname.disabled = true;

    txttransferid.disabled = true;
    txttransferdatetime.disabled = true;
    txttransbankaccname.disabled = true;
    txttransbankaccno.disabled = true;
    txttransbankname.disabled = true;
    txttransbankbranchname.disabled = true;
    paymentdetailsstyle();
}

//
function chequecollaps(){
    $('#collapseOne').collapse("show") ; // Cheque
    $('#collapseTwo').collapse("hide");  // Bank
    $('#collapseThree').collapse("hide");  // Transfer

    txtchequenumber.value = "";
    txtchequedate.value = "";
    txtbankaccname.value = "";
    txtbankaccno.value = "";
    txtbankname.value = "";
    txttransbankbranchname.value = "";
    txttransferid.value = "";
    txttransferdatetime.value = "";

    customerpayment.chequeno = null;
    customerpayment.chequedate = null;
    customerpayment.bankacountname = null;
    customerpayment.bankaccno = null;
    customerpayment.bankname = null;
    customerpayment.bankbranchname = null;
    customerpayment.transferid = null;
    customerpayment.transferdatetime = null;

    txtchequenumber.disabled = false;
    txtchequedate.disabled = false;
    txtbankaccname.disabled = true;
    txtbankaccno.disabled = true;
    txtbankname.disabled = true;

    txttransferid.disabled = true;
    txttransferdatetime.disabled = true;
    txttransbankaccname.disabled = true;
    txttransbankaccno.disabled = true;
    txttransbankname.disabled = true;
    txttransbankbranchname.disabled = true;
}
//
function bankpaymentcollaps(){
    $('#collapseTwo').collapse("show");  // Bank
    $('#collapseOne').collapse("hide") ; // Cheque
    $('#collapseThree').collapse("hide");  // Transfer

    txtchequenumber.value = "";
    txtchequedate.value = "";
    txtbankaccname.value = "";
    txtbankaccno.value = "";
    txtbankname.value = "";
    txttransbankbranchname.value = "";
    txttransferid.value = "";
    txttransferdatetime.value = "";

    customerpayment.chequeno = null;
    customerpayment.chequedate = null;
    customerpayment.bankacountname = null;
    customerpayment.bankaccno = null;
    customerpayment.bankname = null;
    customerpayment.bankbranchname = null;
    customerpayment.transferid = null;
    customerpayment.transferdatetime = null;

    txtchequenumber.disabled = true;
    txtchequedate.disabled = true;
    txtbankaccname.disabled = false;
    txtbankaccno.disabled = false;
    txtbankname.disabled = false;

    txttransferid.disabled = true;
    txttransferdatetime.disabled = true;
    txttransbankaccname.disabled = true;
    txttransbankaccno.disabled = true;
    txttransbankname.disabled = true;
    txttransbankbranchname.disabled = true;
}
//
function transfercollaps(){
    console.log("Transfer")
    $('#collapseThree').collapse("show");  // Transfer
    $('#collapseOne').collapse("hide") ; // Cheque
    $('#collapseTwo').collapse("hide");  // Bank


    txtchequenumber.value = "";
    txtchequedate.value = "";
    txtbankaccname.value = "";
    txtbankaccno.value = "";
    txtbankname.value = "";
    txttransbankbranchname.value = "";
    txttransferid.value = "";
    txttransferdatetime.value = "";

    customerpayment.chequeno = null;
    customerpayment.chequedate = null;
    customerpayment.bankacountname = null;
    customerpayment.bankaccno = null;
    customerpayment.bankname = null;
    customerpayment.bankbranchname = null;
    customerpayment.transferid = null;
    customerpayment.transferdatetime = null;

    txtchequenumber.disabled = true;
    txtchequedate.disabled = true;
    txtbankaccname.disabled = true;
    txtbankaccno.disabled = true;
    txtbankname.disabled = true;

    txttransferid.disabled = false;
    txttransferdatetime.disabled = false;
    txttransbankaccname.disabled = false;
    txttransbankaccno.disabled = false;
    txttransbankname.disabled = false;
    txttransbankbranchname.disabled = false;
}
//
function paymentdetailsstyle(){
    txtchequenumber.style.border = initial;
    txtchequedate.style.border = initial;

    txtbankaccname.style.border = initial;
    txtbankaccno.style.border = initial;
    txtbankname.style.border = initial;

    txttransferid.style.border = initial;
    txttransferdatetime.style.border = initial;
    txttransbankaccname.style.border = initial;
    txttransbankaccno.style.border = initial;
    txttransbankname.style.border = initial;
    txttransbankbranchname.style.border = initial;

}

function setStyle(style) {

    $("#customerpayselect2parent .select2-container").css('border',style);
    $("#customerorderpayselect2parent .select2-container").css('border',style);
    cmbcustomerorder.style.border = style;
    txtorderamount.style.border = style;
    cmbpaytype.style.border = style;
    cmbpaymethod.style.border = style;
    txttotalamount.style.border = style;
    txtpaidamount.style.border = style;
    txtbalanceamount.style.border = style;
    txtCustomerBalanceAmount.style.border = style;
    cmbEmployee.style.border = style;

}

function disableButtons() {

    for(index in customerpayments){

        tblCustomerPayment.children[1].children[index].lastChild.children[0].style.display = "none";
        tblCustomerPayment.children[1].children[index].lastChild.children[1].style.display = "none";
    }

}

function getBankdetailsErrors() {

    var errors = "";
    addvalue = "";

    if (customerpayment.paymethod_id.name == "Cheque"){
        if (customerpayment.chequeno == null) {
            errors = errors + "\n" + "Cheque Number Not Enter";
            txtchequenumber.style.border = invalid;
        } else addvalue = 1;

        if (customerpayment.chequedate == null) {
            errors = errors + "\n" + "Cheque Date Not Selected";
            txtchequedate.style.border = invalid;
        } else addvalue = 1;
    }
    if (customerpayment.paymethod_id.name == "Bank Payment"){
        if (customerpayment.bankacountname == null) {
            errors = errors + "\n" + "Bank Account Name Not Enter";
            txtbankaccname.style.border = invalid;
        } else addvalue = 1;

        if (customerpayment.bankaccno == null) {
            errors = errors + "\n" + "Bank Account Number Not Enter";
            txtbankaccno.style.border = invalid;
        } else addvalue = 1;

        if (customerpayment.bankname == null) {
            errors = errors + "\n" + "Bank Name Not Enter";
            txtbankname.style.border = invalid;
        } else addvalue = 1;
    }
    if (customerpayment.paymethod_id.name == "Transfer"){
        if (customerpayment.bankacountname == null) {
            errors = errors + "\n" + "Bank Account Name Not Enter";
            txttransbankaccname.style.border = invalid;
        } else addvalue = 1;

        if (customerpayment.bankaccno == null) {
            errors = errors + "\n" + "Bank Account Number Not Enter";
            txttransbankaccno.style.border = invalid;
        } else addvalue = 1;

        if (customerpayment.bankname == null) {
            errors = errors + "\n" + "Bank Name Not Enter";
            txttransbankname.style.border = invalid;
        } else addvalue = 1;

        if (customerpayment.bankbranchname == null) {
            errors = errors + "\n" + "Bank Branch Name Not Enter";
            txttransbankbranchname.style.border = invalid;
        } else addvalue = 1;

        if (customerpayment.transferid == null) {
            errors = errors + "\n" + "Transfer ID Not Enter";
            txttransferid.style.border = invalid;
        } else addvalue = 1;

        if (customerpayment.transferdatetime == null) {
            errors = errors + "\n" + "Transfer Date & Time Not Selected";
            txttransferdatetime.style.border = invalid;
        } else addvalue = 1;
    }

    return errors;

}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (customerpayment.bilno == null) {
        errors = errors + "\n" + "Bill Number Not Enter";
        txtbillnumber.style.border = invalid;
    } else addvalue = 1;

    if (customerpayment.customer_id == null) {
        errors = errors + "\n" + "Customer Not Selected";
        $("#customerpayselect2parent .select2-container").css('border',invalid);
    } else addvalue = 1;

    if (customerpayment.corder_id == null) {
        errors = errors + "\n" + "Customer Order Code Not Selected";
        $("#customerorderpayselect2parent .select2-container").css('border',invalid);
    } else addvalue = 1;

    if (customerpayment.orderamount  == null) {
        errors = errors + "\n" + "Order Amount Not Enter";
        txtorderamount.style.border = invalid;
    } else addvalue = 1;

    if (customerpayment.paymenttype_id == null) {
        errors = errors + "\n" + "Payment Type Not Selected";
        cmbpaytype.style.border = invalid;
    } else addvalue = 1;

    if (customerpayment.paymethod_id  == null) {
        errors = errors + "\n" + "Payment Method Not Selected";
        cmbpaymethod.style.border = invalid;
    } else addvalue = 1;


    if (customerpayment.totalamount == null) {
        errors = errors + "\n" + "Total Amount Not Enter";
        txttotalamount.style.border = invalid;
    } else addvalue = 1;

    if (customerpayment.paidamount == null) {
        errors = errors + "\n" + "Paid Amount Not Enter";
        txtpaidamount.style.border = invalid;
    } else addvalue = 1;

    if (customerpayment.balanceamount == null) {
        errors = errors + "\n" + "Balance Amount Not Enter";
        txtbalanceamount.style.border = invalid;
    } else addvalue = 1;

    if (customerpayment.paiddatetime == null) {
        errors = errors + "\n" + "Paid Date Not Selected";
        cmbaddeddate.style.border = invalid;
    } else addvalue = 1;

    if (customerpayment.employee_id == null) {
        errors = errors + "\n" + "Employee Not Selected";
        cmbEmployee.style.border = invalid;
    } else addvalue = 1;

    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (customerpayment.paymethod_id.name == "Cash Payment"){
            savedata();
        }else if (getBankdetailsErrors() == ""){
            savedata();
        }else {
            swal({
                title: "Please Fill Following Payment Details...",
                text: "\n" + getBankdetailsErrors(),
                icon: "error",
                button: true,
            });
        }

    } else {
        swal({
            title: "You have following errors",
            text: "\n" + getErrors(),
            icon: "error",
            button: true,
        });

    }
}

function savedata() {

    swal({
        title: "Are you sure to add following Customer Payment...?",
        text: "\nBill Number : " + customerpayment.bilno +
            "\nCustomer Reg Number : " + customerpayment.customer_id.regno +
            "\nCustomer Order : " + customerpayment.corder_id.cordercode +
            "\nOrder Amount : " + customerpayment.orderamount +
            "\nPay Type : " + customerpayment.paymenttype_id.name +
            "\nPayment Method : " + customerpayment.paymethod_id.name +
            "\nTotal Amount : " + customerpayment.totalamount +
            "\nPaid Amount: " + customerpayment.paidamount +
            "\nBalance Amount : " + customerpayment.balanceamount +
            "\nAdded Date : " + customerpayment.paiddatetime +
            "\nStatus : " + customerpayment.cpaystatus_id.name +
            "\nEmployee Name : " + customerpayment.employee_id.callingname,


        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/customerpayment", "POST", customerpayment);
            if (response == "0") {
                swal({
                    position: 'center',
                    icon: 'success',
                    title: 'Your work has been Done \n Save SuccessFully..!',
                    text: '\n',
                    button: false,
                    timer: 1200
                });
                activer = 1;
                activerowno = 1;
                loadSearchedTable();
                loadForm();
                changeTab('table');
            } else swal({
                title: 'Save not Success... , You have following errors', icon: "error",
                text: '\n ' + response,
                button: true
            });
        }
    });

}

function btnClearMC() {
    //Get Cofirmation from the User window.confirm();
    checkerr = getErrors();

    if (oldcustomerpayment == null && addvalue == "") {
        loadForm();
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                loadForm();
            }

        });
    }

}

function fillForm(cuspay, rowno) {
    activerowno = rowno;

    if (oldcustomerpayment == null) {
        filldata(cuspay);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(cuspay);
            }

        });
    }

}

function filldata(cuspay) {
    clearSelection(tblCustomerPayment);
    selectRow(tblCustomerPayment, activerowno, active);

    customerpayment = JSON.parse(JSON.stringify(cuspay));
    oldcustomerpayment = JSON.parse(JSON.stringify(cuspay));

    txtbillnumber.value = customerpayment.bilno;
    txtorderamount.value = customerpayment.orderamount;
    txttotalamount.value = customerpayment.totalamount;
    txtpaidamount.value = customerpayment.paidamount;
    txtbalanceamount.value = customerpayment.balanceamount;

    fillCombo(cmbcustomer, "Select Customer", customers, "regno", customerpayment.customer_id.regno);
    fillCombo(cmbcustomerorder, "Customer Order", corders, "cordercode", customerpayment.corder_id.cordercode);
    fillCombo(cmbpaytype, "Pay Types", paymenttypes, "name", customerpayment.paymenttype_id.name);
    fillCombo(cmbpaymethod, "Pay Methods", paymethods, "name", customerpayment.paymethod_id.name);
    fillCombo(cmbEmployee, "", employees, "callingname", customerpayment.employee_id.callingname);

    disableButtons();
    setStyle(valid);
    changeTab('form');
}

function getUpdates() {

    var updates = "";

    if (customerpayment != null && oldcustomerpayment != null) {

        if (customerpayment.bilno != oldcustomerpayment.bilno)
            updates = updates + "\nCustomer Payment Bill" + oldcustomerpayment.bilno + " into " + customerpayment.bilno;

        if (customerpayment.customer_id.regno != oldcustomerpayment.customer_id.regno)
            updates = updates + "\nCustomer is Changed.." + oldcustomerpayment.customer_id.regno + " into " + customerpayment.customer_id.regno;

        if (customerpayment.corder_id.cordercode != oldcustomerpayment.corder_id.cordercode)
            updates = updates + "\nCustomer Code is Changed.." + oldcustomerpayment.corder_id.cordercode + " into " + customerpayment.corder_id.cordercode;

        if (customerpayment.orderamount != oldcustomerpayment.orderamount)
            updates = updates + "\nOrder Amount is Changed.." + oldcustomerpayment.orderamount + " into " + customerpayment.orderamount;

        if (customerpayment.paymenttype_id.name != oldcustomerpayment.paymenttype_id.name)
            updates = updates + "\nPayment Type is Changed.." + oldcustomerpayment.paymenttype_id.name + " into " + customerpayment.paymenttype_id.name;

        if (customerpayment.paymethod_id.name != oldcustomerpayment.paymethod_id.name)
            updates = updates + "\nPayment Method is Changed.." + oldcustomerpayment.paymethod_id.name + " into " + customerpayment.paymethod_id.name;

        if (customerpayment.totalamount != oldcustomerpayment.totalamount)
            updates = updates + "\nTotal Amount is Changed.." + oldcustomerpayment.totalamount + " into " + customerpayment.totalamount;

        if (customerpayment.paidamount != oldcustomerpayment.paidamount)
            updates = updates + "\nPaid Amount is Changed.." + oldcustomerpayment.paidamount + " into " + customerpayment.paidamount;

        if (customerpayment.balanceamount != oldcustomerpayment.balanceamount)
            updates = updates + "\nBalance is Changed.." + oldcustomerpayment.balanceamount + " into " + customerpayment.balanceamount;

        if (customerpayment.employee_id.callingname != oldcustomerpayment.employee_id.callingname)
            updates = updates + "\Employee is Changed.." + oldcustomerpayment.employee_id.callingname + " into " + customerpayment.employee_id.callingname;
    }
    return updates;
}

function btnDeleteMC(cuspay) {
    customerpayment = JSON.parse(JSON.stringify(cuspay));

    swal({
        title: "Are you sure to delete following customer paymenet...?",
        text: "\n Bill Number : " + customerpayment.bilno +
            "\n Customer Code : " + customerpayment.customer_id.regno,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/customerpayment", "DELETE", customerpayment);
            if (responce == 0) {
                swal({
                    title: "Deleted Successfully....!",
                    text: "\n\n  Status change to delete",
                    icon: "success", button: false, timer: 1200,
                });
                loadSearchedTable();
                loadForm();
            } else {
                swal({
                    title: "You have following erros....!",
                    text: "\n\n" + responce,
                    icon: "error", button: true,
                });
            }
        }
    });

}

function loadSearchedTable() {

    var searchtext = txtSearchName.value;

    var query = "&searchtext=";

    if (searchtext != "")
        query = "&searchtext=" + searchtext;
    //window.alert(query);
    loadTable(activepage, cmbPageSize.value, query);
    disableButtons();

}

function btnSearchMC() {
    activepage = 1;
    loadSearchedTable();
}

function btnSearchClearMC() {
    loadView();
}

function btnPrintTableMC(customerpayment) {

    var newwindow = window.open();
    formattab = tblCustomerPayment.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Customer Payment Details : </h1></div>" +
        "<div>" + formattab + "</div>" +
        "</body>" +
        "</html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}
