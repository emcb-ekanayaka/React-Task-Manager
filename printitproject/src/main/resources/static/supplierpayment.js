window.addEventListener("load", initialize);

//Initializing Functions

function initialize() {
    $('[data-toggle="tooltip"]').tooltip()

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    cmbpaymethod.addEventListener("change", cmbpaymethodCH);
    cmbsupplier.addEventListener("change", cmbsupplierCH);
    cmbgrn.addEventListener("change", cmbgrnCH);

    txtSearchName.addEventListener("keyup", btnSearchMC);
    txtpaidamount.addEventListener("keyup", paidamountcalculate);

    privilages = httpRequest("../privilage?module=SUPPLIERPAYMENT", "GET");

    //data list for form combo

    suppliers = httpRequest("../supplier/list", "GET");
    grns = httpRequest("../grn/list", "GET");
    supplierpaymentstatus = httpRequest("../supplierpaystatus/list", "GET");
    paymethods = httpRequest("../supplierpaymethod/list", "GET");
    employees = httpRequest("../employee/list", "GET");

    //data list for inner combo
    materials = httpRequest("../material/list", "GET");

    valid = "2px solid green";
    invalid = "2px solid red";
    initial = "2px solid #d6d6c2";
    updated = "2px solid #ff9900";
    active = "#ff9900";


    //refresh View Side
    loadView();

    //refresh form Side
    loadForm();


    $('#formmodel').modal('hide')
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
    supplierpayments = new Array();
    var data = httpRequest("/supplierpayment/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) supplierpayments = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblSupplierpayment', supplierpayments, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblSupplierpayment);

    if (activerowno != "") selectRow(tblSupplierpayment, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldsupplierpayment == null) {
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

function viewitem(supay, rowno) {

    supplierpaymentview = JSON.parse(JSON.stringify(supay));

    tblbillnumber.innerHTML =  supplierpaymentview.billno;
    tblsuppliername.innerHTML =  supplierpaymentview.supplier_id.companyname;
    if (supplierpaymentview.grn_id != null){
        tblgrn.innerHTML =  supplierpaymentview.grn_id.grncode;
        tblgrnamount.innerHTML =  parseFloat(supplierpaymentview.grnamount).toFixed(2);
    }

    tbltotalamount.innerHTML = parseFloat(supplierpaymentview.totalamount).toFixed(2);
    tblpaidamount.innerHTML = parseFloat(supplierpaymentview.paidamount).toFixed(2);
    tblbalanceamount.innerHTML = parseFloat(supplierpaymentview.balanceamount).toFixed(2);
    tblpaiddate.innerHTML = supplierpaymentview.paiddate
    tblstatus.innerHTML = supplierpaymentview.spaystatus_id.name;
    tblemployee.innerHTML = supplierpaymentview.employee_id.callingname;

    tblbankaccountname.innerHTML = "";
    tblbankaccountno.innerHTML = "";
    tblbankname.innerHTML = "";
    tblbankbranchname.innerHTML = "";
    tbltransfer.innerHTML = "";
    tbltransferdate.innerHTML = "";
    tblpaymethod.innerHTML = "";

    tblchequenumber.innerHTML = "";
    tblchequedate.innerHTML = "";


    tblpaymethod.innerHTML = supplierpaymentview.paymethod_id.name;
    if (supplierpaymentview.paymethod_id.name == "Bank Payment"){
        tblbankaccountname.innerHTML = supplierpaymentview.bankaccname;
        tblbankaccountno.innerHTML = supplierpaymentview.bankaccno;
        tblbankname.innerHTML = supplierpaymentview.bankname;

    }

    if (supplierpaymentview.paymethod_id.name == "Transfer"){

        tblbankaccountname.innerHTML = supplierpaymentview.bankaccname;
        tblbankaccountno.innerHTML = supplierpaymentview.bankaccno;
        tblbankname.innerHTML = supplierpaymentview.bankname;
        tblbankbranchname.innerHTML = supplierpaymentview.bankbranchname;
        tbltransfer.innerHTML = supplierpaymentview.transferid;
        tbltransferdate.innerHTML = supplierpaymentview.transferdatetime;
        tblpaymethod.innerHTML = supplierpaymentview.paymethod_id.name;
    }

    if (supplierpaymentview.paymethod_id.name == "Check"){
        tblchequenumber.innerHTML = supplierpaymentview.chequeno;
        tblchequedate.innerHTML = supplierpaymentview.chequedate;

    }

    if (supplierpaymentview.description != null){
        tbldescription.innerHTML = supplierpaymentview.description;
    }


    $('#suppliermodal').modal('show')

}

function btnPrintrow() {

    var format = printformtable.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'></head>" +
        "<body><div style='margin-top: 150px'><h1>Supplier Payment Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);

}

// change payment method and check those methods --> update or add
function cmbpaymethodCH(){

    // change payment and add funtion
    if (oldsupplierpayment == null){
        //check its cash payment or not
        if (JSON.parse(cmbpaymethod.value).name == "Cash Payment"){
            //check every fields of payment methods --> it will check by the previous method
            if(txtchequenumber.value != "" ||  txtbankaccname.value != "" || txtbankaccno.value != "" || txtbankname.value != "" || txttransbankbranchname.value != "" || txttransferid.value != ""){
                swal({
                    title: "Are you sure to Change Payment Type...?",
                    text: "",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                }).then((willDelete) => {
                    //if click ok button the value of that combobox will be binder to that property
                    if (willDelete) {
                        comboBoxBinder(cmbpaymethod,'','supplierpayment','paymethod_id','oldsupplierpayment');
                        disablepaymetdetails();

                    }else {
                        // if click the cancel button previous property value will display
                        fillCombo(cmbpaymethod, "", paymethods, "name", supplierpayment.paymethod_id.name);
                        if(oldsupplierpayment != null && supplierpayment.paymethod_id.name != oldsupplierpayment.paymethod_id.name){
                            cmbpaymethod.style.border = updated;
                        }else {
                            cmbpaymethod.style.border = valid;
                        }
                    }

                });
            }else {
                //if there any no values in payment details side this binder and funtion will run
                comboBoxBinder(cmbpaymethod,'','supplierpayment','paymethod_id','oldsupplierpayment');
                disablepaymetdetails();
            }

        }
        else if(JSON.parse(cmbpaymethod.value).name == "Bank Payment"){

            if (txttransferid.value != "" || txtchequenumber.value != "" || txttransbankaccname.value !=""  || txttransbankaccno.value !="" || txttransbankname.value !="" || txttransbankbranchname.value !=""){
                swal({
                    title: "Are you sure to Change Payment Type...?",
                    text: "",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        comboBoxBinder(cmbpaymethod,'','supplierpayment','paymethod_id','oldsupplierpayment');
                        enablebankdetailfeilds();
                    }else {

                        fillCombo(cmbpaymethod, "", paymethods, "name", supplierpayment.paymethod_id.name);
                        if(oldsupplierpayment != null && supplierpayment.paymethod_id.name != oldsupplierpayment.paymethod_id.name){
                            cmbpaymethod.style.border = updated;

                        }else {
                            cmbpaymethod.style.border = valid;
                        }
                    }
                });
            }else {
                comboBoxBinder(cmbpaymethod,'','supplierpayment','paymethod_id','oldsupplierpayment');
                enablebankdetailfeilds();
            }

        }
        else if(JSON.parse(cmbpaymethod.value).name == "Cheque"){
            if (txtbankaccname.value != "" || txtbankaccno.value != "" || txtbankname.value != "" || txttransbankaccname.value != "" || txttransbankaccno.value != "" || txttransbankname.value != "" || txttransbankbranchname.value != ""){
                swal({
                    title: "Are you sure to Change Payment Type...?",
                    text: "",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        comboBoxBinder(cmbpaymethod,'','supplierpayment','paymethod_id','oldsupplierpayment');
                        enablecheckdetailfeilds();
                    }else {
                        fillCombo(cmbpaymethod, "", paymethods, "name", supplierpayment.paymethod_id.name);
                        if(oldsupplierpayment != null && supplierpayment.paymethod_id.name != oldsupplierpayment.paymethod_id.name){
                            cmbpaymethod.style.border = updated;
                        }else {
                            cmbpaymethod.style.border = valid;
                        }
                    }
                });
            }else {
                comboBoxBinder(cmbpaymethod,'','supplierpayment','paymethod_id','oldsupplierpayment');
                enablecheckdetailfeilds();
            }
        }
        else if(JSON.parse(cmbpaymethod.value).name == "Transfer"){
            if (txtbankaccname.value != "" || txtbankaccno.value != ""  || txtbankname.value != "" || txtchequenumber.value != ""){
                swal({
                    title: "Are you sure to Change Payment Type...?",
                    text: "",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        comboBoxBinder(cmbpaymethod,'','supplierpayment','paymethod_id','oldsupplierpayment');
                        enabletranferdetailfeilds();
                    }else {
                        fillCombo(cmbpaymethod, "", paymethods, "name", supplierpayment.paymethod_id.name);
                        if(oldsupplierpayment != null && supplierpayment.paymethod_id.name != oldsupplierpayment.paymethod_id.name){
                            cmbpaymethod.style.border = updated;
                        }else {
                            cmbpaymethod.style.border = valid;
                        }

                    }
                });
            }else {
                comboBoxBinder(cmbpaymethod,'','supplierpayment','paymethod_id','oldsupplierpayment');
                enabletranferdetailfeilds();
            }

        }
    }


    // change payment method and update funtion
    if(oldsupplierpayment != null){
        if (oldsupplierpayment.paymethod_id != null && JSON.parse(cmbpaymethod.value).name == "Cash Payment"){
            if(oldsupplierpayment.chequeno != null || oldsupplierpayment.chequedate != null || oldsupplierpayment.bankaccname != null || oldsupplierpayment.bankaccno != null || oldsupplierpayment.bankname != null || oldsupplierpayment.bankbranchname != null || oldsupplierpayment.transferid != null || oldsupplierpayment.transferdatetime != null){
                swal({
                    title: "Are you sure to Change Payment Type...?",
                    text: "",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        comboBoxBinder(cmbpaymethod,'','supplierpayment','paymethod_id','oldsupplierpayment');
                        disablepaymetdetails();
                    }else {
                        fillCombo(cmbpaymethod, "Pay Methods", paymethods, "name", supplierpayment.paymethod_id.name);
                        if(oldsupplierpayment != null && supplierpayment.paymethod_id.name != oldsupplierpayment.paymethod_id.name){
                            cmbpaymethod.style.border = updated;
                        }else {
                            cmbpaymethod.style.border = valid;
                        }
                    }

                });
            }else {
                disablepaymetdetails();
                comboBoxBinder(cmbpaymethod,'','supplierpayment','paymethod_id','oldsupplierpayment');
                if(oldsupplierpayment != null && supplierpayment.paymethod_id.name != oldsupplierpayment.paymethod_id.name){
                    cmbpaymethod.style.border = updated;
                }else {
                    cmbpaymethod.style.border = valid;
                }
            }

        }
        else if(oldsupplierpayment.paymethod_id != null && JSON.parse(cmbpaymethod.value).name == "Bank Payment"){
            if (oldsupplierpayment.paymethod_id.name != "Cash Payment"|| oldsupplierpayment.transferid != null || oldsupplierpayment.chequeno != null){
                swal({
                    title: "Are you sure to Change Payment Type...?",
                    text: "",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        comboBoxBinder(cmbpaymethod,'','supplierpayment','paymethod_id','oldsupplierpayment');
                        enablebankdetailfeilds();

                    }else {

                        fillCombo(cmbpaymethod, "Pay Methods", paymethods, "name", supplierpayment.paymethod_id.name);
                        if(oldsupplierpayment != null && supplierpayment.paymethod_id.name != oldsupplierpayment.paymethod_id.name){
                            cmbpaymethod.style.border = updated;
                        }else {
                            cmbpaymethod.style.border = valid;
                        }
                    }
                });
            }else {
                enablebankdetailfeilds();
                comboBoxBinder(cmbpaymethod,'','supplierpayment','paymethod_id','oldsupplierpayment');
                if(oldsupplierpayment != null && supplierpayment.paymethod_id.name != oldsupplierpayment.paymethod_id.name){
                    cmbpaymethod.style.border = updated;
                }else {
                    cmbpaymethod.style.border = valid;
                }
            }

        }
        else if(oldsupplierpayment.paymethod_id != null && JSON.parse(cmbpaymethod.value).name == "Cheque"){
            console.log("B")
            if (oldsupplierpayment.paymethod_id.name != "Cash Payment" || oldsupplierpayment.bankaccname!=null || oldsupplierpayment.transferid != null){
                swal({
                    title: "Are you sure to Change Payment Type...?",
                    text: "",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        comboBoxBinder(cmbpaymethod,'','supplierpayment','paymethod_id','oldsupplierpayment');
                        enablecheckdetailfeilds();
                    }else {
                        fillCombo(cmbpaymethod, "Pay Methods", paymethods, "name", supplierpayment.paymethod_id.name);
                        if(oldsupplierpayment != null && supplierpayment.paymethod_id.name != oldsupplierpayment.paymethod_id.name){
                            cmbpaymethod.style.border = updated;
                        }else {
                            cmbpaymethod.style.border = valid;
                        }
                    }
                });
            }else {
                console.log("B")
                enablecheckdetailfeilds();
                comboBoxBinder(cmbpaymethod,'','supplierpayment','paymethod_id','oldsupplierpayment');
                if(oldsupplierpayment != null && supplierpayment.paymethod_id.name != oldsupplierpayment.paymethod_id.name){
                    cmbpaymethod.style.border = updated;
                }else {
                    cmbpaymethod.style.border = valid;
                }
            }
        }
        else if(oldsupplierpayment.paymethod_id != null && JSON.parse(cmbpaymethod.value).name == "Transfer"){
            if (oldsupplierpayment.paymethod_id.name != "Cash Payment" || oldsupplierpayment.bankaccname!=null || oldsupplierpayment.chequeno != null){
                swal({
                    title: "Are you sure to Change Payment Type...?",
                    text: "",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        comboBoxBinder(cmbpaymethod,'','supplierpayment','paymethod_id','oldsupplierpayment');
                        enabletranferdetailfeilds();
                    }else {
                        fillCombo(cmbpaymethod, "Pay Methods", paymethods, "name", supplierpayment.paymethod_id.name);
                        if(oldsupplierpayment != null && supplierpayment.paymethod_id.name != oldsupplierpayment.paymethod_id.name){
                            cmbpaymethod.style.border = updated;
                        }else {
                            cmbpaymethod.style.border = valid;
                        }

                    }
                });
            }else {
                enabletranferdetailfeilds();
                comboBoxBinder(cmbpaymethod,'','supplierpayment','paymethod_id','oldsupplierpayment');
                if(oldsupplierpayment != null && supplierpayment.paymethod_id.name != oldsupplierpayment.paymethod_id.name){
                    cmbpaymethod.style.border = updated;
                }else {
                    cmbpaymethod.style.border = valid;
                }
            }

        }
    }



}

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

    function enablebankdetailfeilds(){
        $('#collapseTwo').collapse("show")
        txtchequenumber.value = "";
        txtchequedate.value = "";
        txtbankaccname.value = "";
        txtbankaccno.value = "";
        txtbankname.value = "";

        txttransferid.value = "";
        txttransferdatetime.value = "";
        txttransbankaccname.value = "";
        txttransbankaccno.value = "";
        txttransbankname.value = "";
        txttransbankbranchname.value = "";

        supplierpayment.chequeno = null;
        supplierpayment.chequedate = null;
        supplierpayment.bankbranchname = null;
        supplierpayment.transferid = null;
        supplierpayment.transferdatetime = null;

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
        paymentdetailsstyle();
    }

    function enablecheckdetailfeilds(){
        console.log("A")
        $('#collapseOne').collapse("show")
        txtchequenumber.value = "";
        txtchequedate.value = "";

        txtbankaccname.value = "";
        txtbankaccno.value = "";
        txtbankname.value = "";

        txttransferid.value = "";
        txttransferdatetime.value = "";
        txttransbankaccname.value = "";
        txttransbankaccno.value = "";
        txttransbankname.value = "";
        txttransbankbranchname.value = "";

        supplierpayment.bankaccname = null ;
        supplierpayment.bankaccno = null ;
        supplierpayment.bankname = null ;
        supplierpayment.bankbranchname = null ;
        supplierpayment.transferid = null ;
        supplierpayment.transferdatetime = null ;

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
        paymentdetailsstyle();
    }

    function enabletranferdetailfeilds(){
        $('#collapseThree').collapse("show")
    txtchequenumber.value = "";
    txtchequedate.value = "";

    txtbankaccname.value = "";
    txtbankaccno.value = "";
    txtbankname.value = "";

    txttransferid.value = "";
    txttransferdatetime.value = "";
    txttransbankaccname.value = "";
    txttransbankaccno.value = "";
    txttransbankname.value = "";
    txttransbankbranchname.value = "";

    supplierpayment.chequeno = null;
    supplierpayment.chequedate = null;

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
    paymentdetailsstyle();

        // Trans date and time
        txttransferdatetime.max = getCurrentDateTime("datetime");
        let today = new Date();
        let beforeoneweek = new Date();
        beforeoneweek.setDate(today.getDate()-7);
        let month = beforeoneweek.getMonth()+1;
        if (month < 10) month = "0" +month;
        let day = beforeoneweek.getDate();
        if (day < 10) day = "0"+day;
        txttransferdatetime.min = beforeoneweek.getFullYear()+"-"+month+"-"+day +"T00:00";
}

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

        supplierpayment.chequeno = null;
        supplierpayment.chequedate = null;
        supplierpayment.bankaccname = null;
        supplierpayment.bankaccno = null;
        supplierpayment.bankname = null;
        supplierpayment.bankbranchname = null;
        supplierpayment.transferid = null;
        supplierpayment.transferdatetime = null;

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


function cmbsupplierCH(){

    grnbysupplier = httpRequest("/grn/listbysupplier?supplierid=" + JSON.parse(cmbsupplier.value).id, "GET");

    if (grnbysupplier.length != 0){
        fillCombo(cmbgrn, "Select Grn", grnbysupplier, "grncode", "");
        cmbgrn.disabled = false;

    }else {

        cmbgrn.disabled = true;
    }

    arrestamount=0;
    cmbgrn.value = "";
    txtbalanceamount.value = "";
    txtpaidamount.value = "";

    cmbgrn.style.border = initial;
    txtgrnamount.style.border = initial;
    txtbalanceamount.style.border = initial;
    txtpaidamount.style.border = initial;

    supplierpayment.paidamount = null;
    supplierpayment.balanceamount = null;
    supplierpayment.grn_id = null;
    supplierpayment.totalamount = null;

    arrestamount = supplierpayment.supplier_id.arrestamount;
    if (arrestamount!=0){
        txttotalamount.value = arrestamount;
        txttotalamount.style.border = valid;
        supplierpayment.totalamount =  txttotalamount.value;
    }else {
        txttotalamount.value = "0.00";
        supplierpayment.totalamount = toDecimal("0");
        txttotalamount.style.border = initial;
    }
    txtgrnamount.value ="0.00";
    supplierpayment.grnamount  = doDecimal(txtgrnamount.value,2);

    txtbalanceamount.value ="0.00";
    supplierpayment.balanceamount  = doDecimal(txtbalanceamount.value,2);
}

function cmbgrnCH(){
    totalamount=0;

    txtpaidamount.style.border = initial;
    txtbalanceamount.style.border = initial;
    txtpaidamount.value = "";
    txtbalanceamount.value = "";
    supplierpayment.paidamount = null;
    supplierpayment.balanceamount = null;

    txtgrnamount.value = parseFloat(supplierpayment.grn_id.nettotal);
    txtgrnamount.style.border = valid;
    supplierpayment.grnamount = txtgrnamount.value;
    if (supplierpayment.totalamount != null){
        totalamount = parseFloat(supplierpayment.totalamount) + parseFloat(txtgrnamount.value);
    }else {
        totalamount =  parseFloat(txtgrnamount.value);
    }


    txttotalamount.value = parseFloat(totalamount);
    supplierpayment.totalamount = txttotalamount.value;
    txttotalamount.style.border = valid;

}
function paidamountcalculate(){

    if (parseFloat(txtpaidamount.value) > parseFloat(txttotalamount.value)|| parseFloat(txtpaidamount.value) ==0){
        swal({
            title: "Can not Add This value...!",
            icon: "warning", buttons: true, dangerMode: true,
            className: "swal-button",
        });
        txtpaidamount.value ="";
        txtbalanceamount.value ="";

        txtpaidamount.style.border = initial;
        txtbalanceamount.style.border = initial;

    }else {
        txtbalanceamount.value = parseFloat(supplierpayment.totalamount) - parseFloat(txtpaidamount.value);
        txtbalanceamount.style.border = valid;
        supplierpayment.balanceamount = txtbalanceamount.value;
    }

}

function loadForm() {
    supplierpayment = new Object();
    oldsupplierpayment = null;

    cmbsupplier.disabled = false;
    txtpaidamount.disabled = false;

    fillCombo(cmbsupplier, "Select Supplier", suppliers, "companyname", "");
    fillCombo(cmbgrn, "Select GRN", grns, "grncode", "");
    fillCombo(cmdstatus, "Pay Status", supplierpaymentstatus, "name", "Paid");
    fillCombo(cmbpaymethod, "", paymethods, "name", "Cash Payment");
    supplierpayment.paymethod_id =  paymethods[0];
    cmbpaymethod.style.border = valid;

    fillCombo(cmdemployee, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);

    supplierpayment.spaystatus_id = JSON.parse(cmdstatus.value);
    supplierpayment.employee_id = JSON.parse(cmdemployee.value);
    cmdstatus.disabled = true;
    cmdemployee.disabled = true;

    cmdpaiddate.value= getCurrentDateTime("date");
    supplierpayment.paiddate = cmdpaiddate.value;
    cmdpaiddate.disabled = true;
    cmdpaiddate.style.border = valid;

    // Get Next Number Form Data Base
    var nextNumber = httpRequest("/supplierpayment/nextnumber", "GET");
    billnumber.value = nextNumber.billno;
    supplierpayment.billno = billnumber.value;
    billnumber.disabled = "disabled";
    billnumber.style.border = valid;

    cmbgrn.value = "";
    txtgrnamount.value = "";
    txttotalamount.value = "";
    txtpaidamount.value = "";
    txtbalanceamount.value = "";
    txtdescription.value = "";

    txtchequenumber.value = "";
    txtchequedate.value = "";
    txtbankaccname.value = "";
    txtbankaccno.value = "";
    txtbankname.value = "";

    txttransbankaccname.value = "";
    txttransbankaccno.value = "";
    txttransbankname.value = "";
    txttransbankbranchname.value = "";
    txttransferid.value = "";
    txttransferdatetime.value = "";

    setStyle(initial);
    cmdstatus.style.border = valid;
    cmdemployee.style.border = valid;
    cmdpaiddate.style.border = valid;

    cmbgrn.disabled = true;
    txtgrnamount.disabled = true;
    txttotalamount.disabled = true;
    txtbalanceamount.disabled = true;

    txtchequenumber.disabled = true;
    txtchequedate.disabled = true;
    txtbankaccname.disabled = true;
    txtbankaccno.disabled = true;
    txtbankname.disabled = true;

    txttransbankaccname.disabled = true;
    txttransbankaccno.disabled = true;
    txttransbankname.disabled = true;
    txttransbankbranchname.disabled = true;
    txttransferid.disabled = true;
    txttransferdatetime.disabled = true;

    txtgrnamount.value ="0.00";
    supplierpayment.grnamount  = doDecimal(txtgrnamount.value,2);

    txttotalamount.value ="0.00";
    supplierpayment.totalamount  = doDecimal(txttotalamount.value,2);

    txtbalanceamount.value ="0.00";
    supplierpayment.balanceamount  = doDecimal(txtbalanceamount.value,2);

    disableButtons(false,true,true);
    disablepaymetdetails();
    paymentdetailsstyle();

}


function btnInnerAddMc() {}

function fillInnerForm() {}

function btnInnerDeleteMC(innerob, innerrow) {}

function viewInnerMaterial() {}

function setStyle(style) {

    cmbsupplier.style.border = style;
    cmbgrn.style.border = style;
    txtgrnamount.style.border = style;
    txttotalamount.style.border = style;
    txtpaidamount.style.border = style;
    txtbalanceamount.style.border = style;
    txtdescription.style.border = style;
    cmdpaiddate.style.border = style;
    cmdstatus.style.border = style;
    cmdemployee.style.border = style;

}

function disableButtons(add, upd, del) {

    if (add || !privilages.add) {
        btnAdd.setAttribute("disabled", "disabled");
        $('#btnAdd').css('cursor', 'not-allowed');
    } else {
        btnAdd.removeAttribute("disabled");
        $('#btnAdd').css('cursor', 'pointer');
    }

    if (upd || !privilages.update) {
        btnUpdate.setAttribute("disabled", "disabled");
        $('#btnUpdate').css('cursor', 'not-allowed');
    } else {
        btnUpdate.removeAttribute("disabled");
        $('#btnUpdate').css('cursor', 'pointer');
    }

    if (!privilages.update) {
        $(".buttonup").prop('disabled', true);
        $(".buttonup").css('cursor', 'not-allowed');
    } else {
        $(".buttonup").removeAttr("disabled");
        $(".buttonup").css('cursor', 'pointer');
    }

    if (!privilages.delete) {
        $(".buttondel").prop('disabled', true);
        $(".buttondel").css('cursor', 'not-allowed');
    } else {
        $(".buttondel").removeAttr("disabled");
        $(".buttondel").css('cursor', 'pointer');
    }

    for(inde in supplierpayments) {

        tblSupplierpayment.children[1].children[inde].lastChild.children[1].style.display = "none";

      /*  if(supplierpayments[index].spaystatus_id.name == "Deleted") {
            tblSupplierpayment.children[1].children[index].style.color = "#f00";
            tblSupplierpayment.children[1].children[index].style.border = "2px solid red";

        }*/
    }

}


function getErrors() {

    var errors = "";
    addvalue = "";

    if (supplierpayment.billno == null) {
        errors = errors + "\n" + "Bill Number Not Enter";
        billnumber.style.border = invalid;
    } else addvalue = 1;

    if (supplierpayment.supplier_id == null) {
        errors = errors + "\n" + "Supplier Not Enter";
        cmbsupplier.style.border = invalid;
    } else addvalue = 1;

  /*  if (grnbysupplier.length != 0 && supplierpayment.grn_id == null) {
        errors = errors + "\n" + "GRN Not Selected";
        cmbgrn.style.border = invalid;
    } else addvalue = 1;

    if (grnbysupplier.length != 0 && supplierpayment.grnamount == null) {
        errors = errors + "\n" + "GRN Amount Not Selected";
        txtgrnamount.style.border = invalid;
    } else addvalue = 1;*/

    if (supplierpayment.totalamount == null) {
        errors = errors + "\n" + "Total Amount Not Enter";
        txttotalamount.style.border = invalid;
    } else addvalue = 1;

    if (supplierpayment.paidamount == null) {
        errors = errors + "\n" + "Paid Amount Not Enter";
        txtpaidamount.style.border = invalid;
    } else addvalue = 1;

    if (supplierpayment.balanceamount == null) {
        errors = errors + "\n" + "Balance Amount Not Enter";
        txtbalanceamount.style.border = invalid;
    } else addvalue = 1;

    if (supplierpayment.paymethod_id == null) {
        errors = errors + "\n" + "Payment Method Not Selected";
        cmbpaymethod.style.border = invalid;
    } else addvalue = 1;

    if (supplierpayment.spaystatus_id == null) {
        errors = errors + "\n" + "Supplier Payment Status Not Selected";
        cmdstatus.style.border = invalid;
    } else addvalue = 1;

    if (supplierpayment.employee_id.callingname == null) {
        errors = errors + "\n" + "Employee Not Selected";
        cmdemployee.style.border = invalid;
    } else addvalue = 1;

    if (supplierpayment.paiddate == null) {
        errors = errors + "\n" + "Paid Date Not Selected";
        cmdpaiddate.style.border = invalid;
    } else addvalue = 1;

  if (supplierpayment.paymethod_id != null && supplierpayment.paymethod_id.name == "Bank Payment") {

      if (supplierpayment.bankaccname == null) {
          errors = errors + "\n" + "Bank Account Name Not Enter";
          txtbankaccname.style.border = invalid;
      } else addvalue = 1;

      if (supplierpayment.bankaccno == null) {
          errors = errors + "\n" + "Bank Account Number Not Enter";
          txtbankaccno.style.border = invalid;
      } else addvalue = 1;

      if (supplierpayment.bankname == null) {
          errors = errors + "\n" + "Bank Name Not Enter";
          txtbankname.style.border = invalid;
      } else addvalue = 1;

  }
    if (supplierpayment.paymethod_id != null && supplierpayment.paymethod_id.name == "Transfer") {


        if (supplierpayment.transferid == null) {
            errors = errors + "\n" + "Trans Ferid Not Enter";
            txttransferid.style.border = invalid;
        } else addvalue = 1;

        if (supplierpayment.transferdatetime == null) {
            errors = errors + "\n" + "Trans date Not Selected";
            txttransferdatetime.style.border = invalid;
        } else addvalue = 1;

        if (supplierpayment.bankaccname == null) {
            errors = errors + "\n" + "Bank Account Name Not Enter";
            txttransbankaccname.style.border = invalid;
        } else addvalue = 1;

        if (supplierpayment.bankaccno == null) {
            errors = errors + "\n" + "Bank Account Number Not Enter";
            txttransbankaccno.style.border = invalid;
        } else addvalue = 1;

        if (supplierpayment.bankname == null) {
            errors = errors + "\n" + "Bank Name Not Enter";
            txttransbankname.style.border = invalid;
        } else addvalue = 1;

        if (supplierpayment.bankbranchname == null) {
            errors = errors + "\n" + "Bank Branch Name Not Enter";
            txttransbankbranchname.style.border = invalid;
        } else addvalue = 1;

    }
    if (supplierpayment.paymethod_id != null && supplierpayment.paymethod_id.name == "Check") {

        if (supplierpayment.chequeno == null) {
            errors = errors + "\n" + "Chequeno Not Enter";
            txtchequenumber.style.border = invalid;
        } else addvalue = 1;

        if (supplierpayment.chequedate == null) {
            errors = errors + "\n" + "Cheque Date Not Selected";
            txtchequedate.style.border = invalid;
        } else addvalue = 1;
  }
    return errors;

}

function btnAddMC(){
    if(getErrors()==""){
        if(txtdescription.value ==""){
            swal({
                title: "Are you sure to continue...?",
                text: "Form has some empty fields.....",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    savedata();
                }
            });

        }else{
            savedata();
        }
    }else{
        swal({
            title: "You have following errors",
            text: "\n"+getErrors(),
            icon: "error",
            button: true,
        });

    }
}


function savedata() {
        swal({
            title: "Are you sure to add following Supplier Payment...?",
            text: "\nBill Number : " + supplierpayment.billno +
                "\nCompany Name : " + supplierpayment.supplier_id.companyname +
                "\nTotal Amount : " + supplierpayment.totalamount +
                "\nPaid Amount : " + supplierpayment.paidamount +
                "\nBalance Amount : " + supplierpayment.balanceamount +
                "\nMethod: " + supplierpayment.paymethod_id.name +
                "\nPaid Date : " + supplierpayment.paiddate +
                "\nStatus : " + supplierpayment.spaystatus_id.name +
                "\nEmployee : " + supplierpayment.employee_id.callingname,

            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                var response = httpRequest("/supplierpayment", "POST", supplierpayment);
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
                    $('#formmodel').modal('hide')
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

    if (oldsupplier == null && addvalue == "") {
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

function fillForm(sup, rowno) {
    activerowno = rowno;

    if (oldsupplierpayment == null) {
        filldata(sup);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(sup);
            }

        });
    }

}


function filldata(suppay) {
    clearSelection(tblSupplierpayment);
    selectRow(tblSupplierpayment, activerowno, active);

    supplierpayment = JSON.parse(JSON.stringify(suppay));
    oldsupplierpayment = JSON.parse(JSON.stringify(suppay));

    billnumber.value = supplierpayment.billno;
    txttotalamount.value = supplierpayment.totalamount;
    txtpaidamount.value = supplierpayment.paidamount;
    txtbalanceamount.value = supplierpayment.balanceamount;
    txtdescription.value = supplierpayment.description;
    cmdpaiddate.value = supplierpayment.paiddate;
    cmbpaymethod.value = supplierpayment.paymethod_id.name;

    if (supplierpayment.paymethod_id.name == "Check"){

        txtchequenumber.value = supplierpayment.chequeno;
        txtchequedate.value = supplierpayment.chequedate;

    }

    if (supplierpayment.paymethod_id.name == "Bank Payment"){
        txtbankaccname.value = supplierpayment.bankaccname;
        txtbankaccno.value = supplierpayment.bankaccno;
        txtbankname.value = supplierpayment.bankname;
    }

    if (supplierpayment.paymethod_id.name == "Transfer"){

        txttransbankaccname.value = supplierpayment.bankaccname;
        txttransbankaccno.value = supplierpayment.bankaccno;
        txttransbankname.value = supplierpayment.bankname;
        txttransbankbranchname.value = supplierpayment.bankbranchname;
        txttransferid.value = supplierpayment.transferid;
        txttransferdatetime.value = supplierpayment.transferdatetime;
    }



    fillCombo(cmbsupplier, "Select Supplier", suppliers, "companyname", supplierpayment.supplier_id.companyname);
    if(supplierpayment.grn_id != null){
        fillCombo(cmbgrn, "", grns, "grncode", supplierpayment.grn_id.grncode);
        txtgrnamount.value = supplierpayment.grnamount;
    }

    fillCombo(cmbpaymethod, "Select Status",paymethods , "name", supplierpayment.paymethod_id.name);
    fillCombo(cmdstatus, "Select Status", supplierpaymentstatus, "name", supplierpayment.spaystatus_id.name);
    fillCombo(cmdemployee, "Select Employeee", employees, "callingname", supplierpayment.employee_id.callingname);
    cmdstatus.disabled = false;

    disableButtons(true, false, false);
    setStyle(valid);
      //check null statements

    if (supplierpayment.chequeno == null && supplierpayment.chequedate == null && supplierpayment.bankaccname == null && supplierpayment.bankaccno == null && supplierpayment.bankname == null && supplierpayment.bankbranchname == null && supplierpayment.transferid == null && supplierpayment.transferdatetime == null) {

        disablepaymetdetails();

    }
    if (supplierpayment.paymethod_id.name == "Bank Payment"){

        txtbankaccname.style.border = valid;
        txtbankaccno.style.border = valid;
        txtbankname.style.border = valid;

        txtbankaccname.disabled = false;
        txtbankaccno.disabled = false;
        txtbankname.disabled = false;

        $('#collapseTwo').collapse("show")
    }

    if (supplierpayment.paymethod_id.name == "Transfer"){

        txttransbankaccname.style.border = valid;
        txttransbankaccno.style.border = valid;
        txttransbankname.style.border = valid;
        txttransbankbranchname.style.border = valid;
        txttransferid.style.border = valid;
        txttransferdatetime.style.border = valid;

        txttransbankaccname.disabled = false;
        txttransbankaccno.disabled = false;
        txttransbankname.disabled = false;
        txttransbankbranchname.disabled = false;
        txttransferid.disabled = false;
        txttransferdatetime.disabled = false;
        $('#collapseThree').collapse("show")
    }

    if (supplierpayment.paymethod_id.name == "Check"){

        txtchequenumber.style.border = valid;
        txtchequedate.style.border = valid;

        txtchequenumber.disabled = false;
        txtchequedate.disabled = false;
        $('#collapseOne').collapse("show")
    }

    if (supplierpayment.description == null){
        txtdescription.style.border = initial;
    }

    if (supplierpayment.grn_id == null){
        cmbgrn.style.border = initial;
        txtgrnamount.style.border = initial;
    }


    $('#formmodel').modal('show')

    cmbsupplier.disabled = true;
    txtpaidamount.disabled = true;
    cmdstatus.disabled = true;

    disableButtons(true, false, false);
}

function getUpdates() {

    var updates = "";

    if (supplierpayment != null && oldsupplierpayment != null) {

        if (supplierpayment.billno != oldsupplierpayment.billno)
            updates = updates + "\nBill Number is Changed.." + oldsupplierpayment.billno + " into " + supplierpayment.billno;

        if (supplierpayment.supplier_id.companyname != oldsupplierpayment.supplier_id.companyname)
            updates = updates + "\nSupplier is Changed.." + oldsupplierpayment.supplier_id.companyname + " into " + supplierpayment.supplier_id.companyname;

       if(oldsupplierpayment.grn_id != null && supplierpayment.grn_id != null ){
           if (supplierpayment.grn_id.grncode != oldsupplierpayment.grn_id.grncode)
               updates = updates + "\nGrn Code is Changed.." + oldsupplierpayment.grn_id.grncode + " into " + supplierpayment.grn_id.grncode;

           if (supplierpayment.grnamount != oldsupplierpayment.grnamount)
               updates = updates + "\nGrn Amount is Changed.." + oldsupplierpayment.grnamount + " into " + supplierpayment.grnamount;

       }
        if (supplierpayment.totalamount != oldsupplierpayment.totalamount)
            updates = updates + "\nTotal Amount is Changed.." + oldsupplierpayment.totalamount + " into " + supplierpayment.totalamount;

        if (supplierpayment.paidamount != oldsupplierpayment.paidamount)
            updates = updates + "\nPaid Amount is Changed.." + oldsupplierpayment.paidamount + " into " + supplierpayment.paidamount;

        if (supplierpayment.balanceamount != oldsupplierpayment.balanceamount)
            updates = updates + "\nBalance Amount is Changed.." + oldsupplierpayment.balanceamount + " into " + supplierpayment.balanceamount;

        if (supplierpayment.paymethod_id.name != oldsupplierpayment.paymethod_id.name)
            updates = updates + "\nPay Method is Changed.." + oldsupplierpayment.paymethod_id.name + " into " + supplierpayment.paymethod_id.name;

        if (supplierpayment.description != oldsupplierpayment.description)
            updates = updates + "\nDescription is Changed.." + oldsupplierpayment.description + " into " + supplierpayment.description;

        if (supplierpayment.paiddate != oldsupplierpayment.paiddate)
            updates = updates + "\nPaid Date is Changed.." + oldsupplierpayment.paiddate + " into " + supplierpayment.paiddate;

        if (supplierpayment.spaystatus_id.name != oldsupplierpayment.spaystatus_id.name)
            updates = updates + "\nStatus is Changed.." + oldsupplierpayment.spaystatus_id.name + " into " + supplierpayment.spaystatus_id.name;

        if (supplierpayment.employee_id.callingname != oldsupplierpayment.employee_id.callingname)
            updates = updates + "\nEmployee is Changed.." + oldsupplierpayment.employee_id.callingname + " into " + supplierpayment.employee_id.callingname;

// Bank Details

        if (supplierpayment.chequeno != oldsupplierpayment.chequeno)
            updates = updates + "\nCheque Number is Changed.." + oldsupplierpayment.chequeno + " into " + supplierpayment.chequeno;

        if (supplierpayment.chequedate != oldsupplierpayment.chequedate)
            updates = updates + "\nRequested Date is Changed.." + oldsupplierpayment.chequedate + " into " + supplierpayment.chequedate;

        if (supplierpayment.bankaccname != oldsupplierpayment.bankaccname)
            updates = updates + "\nBank Account Number is Changed.." + oldsupplierpayment.bankaccname + " into " + supplierpayment.bankaccname;

        if (supplierpayment.bankaccno != oldsupplierpayment.bankaccno)
            updates = updates + "\nBank Account Number is Changed.." + oldsupplierpayment.bankaccno + " into " + supplierpayment.bankaccno;

        if (supplierpayment.bankname != oldsupplierpayment.bankname)
            updates = updates + "\nBank Name is Changed.." + oldsupplierpayment.bankname + " into " + supplierpayment.bankname;

        if (supplierpayment.bankbranchname != oldsupplierpayment.bankbranchname)
            updates = updates + "\nBank Branch Name is Changed.." + oldsupplierpayment.bankbranchname + " into " + supplierpayment.bankbranchname;

        if (supplierpayment.transferid != oldsupplierpayment.transferid)
            updates = updates + "\nTrans Ferid is Changed.." + oldsupplierpayment.transferid + " into " + supplierpayment.transferid;

        if (supplierpayment.transferdatetime != oldsupplierpayment.transferdatetime)
            updates = updates + "\nTrans Date is Changed.." + oldsupplierpayment.transferdatetime + " into " + supplierpayment.transferdatetime;

    }

    return updates;

}

function btnUpdateMC() {
    var errors = getErrors();
    if (errors == "") {
        var updates = getUpdates();
        if (updates == ""){
            swal({
                title: 'Nothing Updated..!',icon: "warning",
                text: '\n',
                button: false,
                timer: 1200});
        } else {
            swal({
                title: "Are you sure to update following Supplier Payment Details...?",
                text: "\n"+ getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/supplierpayment", "PUT", supplierpayment);
                        if (response == "0") {
                            swal({
                                position: 'center',
                                icon: 'success',
                                title: 'Your work has been Done \n Update SuccessFully..!',
                                text: '\n',
                                button: false,
                                timer: 1200
                            });
                            loadSearchedTable();
                            loadForm();
                            //changeTab('table');

                            $('#formmodel').modal('hide')

                        }
                        else

                            swal({
                                title: 'Failed to Update',icon: "error",
                                text: '\n '+ response,
                                button: true});
                    }
                });
        }
    }
    else
        swal({
            title: 'You have following errors in your form',icon: "error",
            text: '\n '+getErrors(),
            button: true});

}


function btnDeleteMC(supay) {
    supplierpayment = JSON.parse(JSON.stringify(supay));

    swal({
        title: "Are you sure to delete following Supplier payment...?",
        text: "\n Bill Number : " + supplierpayment.billno +
            "\n Company Name  : " + supplierpayment.supplier_id.companyname,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/supplierpayment", "DELETE", supplierpayment);
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
    disableButtons(true, false, false);

}



function btnSearchMC() {
    activepage = 1;
    loadSearchedTable();
}

function btnSearchClearMC() {
    loadView();
}

function btnPrintTableMC(sup) {

    //open a new window for print table
    var newwindow = window.open();
    //get the table view for a variable
    formattab = tblSupplierpayment.outerHTML;

    //write the table for the new open tab
    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 50px; '> <h1>Supplier Payment Details : </h1></div>" +
        "<div>" + formattab + "</div>" +
        "</body>" +
        "</html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}
function closeviewmodule() {

    var update =  getUpdates()
    var errors = getErrors();
    if (errors == "" && update == "") {
        $('#formmodel').modal('hide')
        initialize();
    }else
        swal({
            title: "Do want to close the model...?",
            icon: "warning", buttons: true, dangerMode: true,
            className: "swal-button",
        }).then((willDelete) => {
            if (willDelete) {
                $('#formmodel').modal('hide')
                initialize();

            }
        });
}

function sortTable(cind) {
    cindex = cind;

    var cprop = tblEmployee.firstChild.firstChild.children[cindex].getAttribute('property');

    if (cprop.indexOf('.') == -1) {
        employees.sort(
            function (a, b) {
                if (a[cprop] < b[cprop]) {
                    return -1;
                } else if (a[cprop] > b[cprop]) {
                    return 1;
                } else {
                    return 0;
                }
            }
        );
    } else {
        employees.sort(
            function (a, b) {
                if (a[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)] < b[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)]) {
                    return -1;
                } else if (a[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)] > b[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)]) {
                    return 1;
                } else {
                    return 0;
                }
            }
        );
    }
    fillTable('tblEmployee', employees, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblEmployee);
    loadForm();

    if (activerowno != "") selectRow(tblEmployee, activerowno, active);


}