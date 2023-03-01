window.addEventListener("load", initialize);

//Initializing Functions

function initialize() {
    $('[data-toggle="tooltip"]').tooltip()
    $('.collapse').collapse("hide")

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    $('.js-example-basic-single').select2();

    cmbcutomertype.addEventListener("change", cmbcutomertypeCH); // customer filter eka (whole select or rental)
   // cmbcustomerstatus.addEventListener("change", cmbcustomerstatusCH);
    //cmbcustomer.addEventListener("change", cmbcustomerCH);  // customer full details can see under the customer field
   // cmbproducttype.addEventListener("change", cmbproducttypeCH); // product filter by selecting product type
    //cmbproduct.addEventListener("change", cmbproductCH);    // product price by selecting product
    txtquantity.addEventListener("keyup", linetotalcalculate); // line total will calculate by typing quantity
    txtdiscount.addEventListener("keyup", discountcalculate); // discount will calculate by total amount
    txtadvaceamount.addEventListener("keyup", advaceamountcalculate); // balance = Net total - advance or balance = net total if no advance


    txtSearchName.addEventListener("keyup", btnSearchMC);

    privilages = httpRequest("../privilage?module=CUSTOMERORDER", "GET");

    //data list for form combo
    customers = httpRequest("../customer/list", "GET");
    customertypes = httpRequest("../customertype/list", "GET");
    customerorderstatus = httpRequest("../customeroderstatus/list", "GET");
    employees = httpRequest("../employee/list", "GET");
    cities = httpRequest("../city/list", "GET");

    //data list for inner combo
    producttypes = httpRequest("../producttype/list", "GET");
    products = httpRequest("../product/list", "GET");

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
    corders = new Array();
    var data = httpRequest("/customerorder/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) corders = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblCorder', corders, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblCorder);

    if (activerowno != "") selectRow(tblCorder, activerowno, active);

}

function paginate(page){
    var paginate;
    if (oldcorder == null) {
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

function viewitem(co, rowno) {

    corderview = JSON.parse(JSON.stringify(co));

    tblCordernumber.innerHTML =  corderview.cordercode;
    tblCustomertype.innerHTML =  corderview.customertype_id.name;
    if (corderview.customertype_id.name == "Whole"){
        tblCustomer.innerHTML =  corderview.customer_id.companyname;

    }else {
        tblCustomer.innerHTML =  corderview.customer_id.fname;
    }

    tblRequiredate.innerHTML =  corderview.requiredate;
    tblAddeddate.innerHTML = corderview.addeddate;

    tblEmployee.innerHTML = corderview.employee_id.callingname;
    tblCorderstatus.innerHTML = corderview.corderstatus_id.name;
    tblTotalamount.innerHTML = parseFloat(corderview.totalamount).toFixed(2);
    tblDiscount.innerHTML = corderview.discountrate;
    tblNetTotal.innerHTML = parseFloat(corderview.nettotal).toFixed(2);
    tblAdvanceamount.innerHTML = parseFloat(corderview.advaceamount).toFixed(2);
    tblBalanceamount.innerHTML = parseFloat(corderview.balanceamount).toFixed(2);

    fillInnerTable("tblPrintInnerCustomerorder", corderview.corderHasProductList, fillInnerForm, btnInnerDeleteMC, viewInnerOrderProduct)
    $('#viewmodal').modal('show')

    if (corderview.description != null){
        tblDescription.innerHTML = corderview.description;
    }

}

function btnPrintrow() {

    var format = printformtable.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'></head>" +
        "<body><div style='margin-top: 150px'><h1>Customer Order Product Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);

}

function loadForm() {
    corder = new Object();
    oldcorder = null;

    //create array List

    corder.corderHasProductList = new Array();

    fillCombo(cmbcutomertype, "Select Customer Type", customertypes, "name", "");
    fillCombo(cmbcities, "Select City", cities, "name", "");
    fillCombo3(cmbcustomer, "Select Customer", customers, "regno", "");
    fillCombo(cmbcorderstatus, "", customerorderstatus, "name", "Ordered");
    //fillCombo(cmbcustomerstatus, "", customerorderstatus, "name", "");
    fillCombo(cmbemployee, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    corder.employee_id = JSON.parse(cmbemployee.value);
    corder.corderstatus_id = JSON.parse(cmbcorderstatus.value);
    cmbcorderstatus.disabled = true;
    cmbemployee.disabled = true;

   //Added date Field
    dtaaddeddate.value= getCurrentDateTime("date");
    corder.addeddate = dtaaddeddate.value;
    dtaaddeddate.disabled = true;
    dtaaddeddate.style.border = valid;

  // Get Next Number Form Data Base
    var nextNumber = httpRequest("/customerorder/nextnumber", "GET");
    txtcordernmb.value = nextNumber.cordercode;
    corder.cordercode = txtcordernmb.value;
    txtcordernmb.disabled = "disabled";
    txtcordernmb.style.border = valid;

    // Require Date
    dtrequiredate.min = getCurrentDateTime("date");
    let today = new Date();
    let afteroneweek = new Date();
    afteroneweek.setDate(today.getDate()+7);
    let month = afteroneweek.getMonth()+1;
    if (month < 10) month = "0" +month;
    let day = afteroneweek.getDate();
    if (day < 10) day = "0"+day;
    dtrequiredate.max = afteroneweek.getFullYear()+"-"+month+"-"+day;

    txtdiscount.value = "0";
    corder.discountrate = txtdiscount.value;
    cmbcutomertype.value = "";
    cmbcustomer.value = "";
    dtrequiredate.value = "";
    txttotalamount.value = "";
    txtnettotal.value = "";
    txtadvaceamount.value = "";
    txtbalanceamount.value = "";
    txtDescription.value = "";
    fullname.innerHTML = "";

    setStyle(initial);
    cmbcorderstatus.style.border = valid;
    cmbemployee.style.border = valid;
    dtaaddeddate.style.border = valid;

    txttotalamount.disabled = true;
    txtmaxqty.disabled = true;
    txtnettotal.disabled = true;
    txtbalanceamount.disabled = true;
    cmbcustomer.disabled = true;
    txtdiscount.disabled = true;
    dtrequiredate.disabled = true;

    disableButtons(false, true, true);
    refreshInnerForm();
}

/*function cmbcustomerstatusCH(){
    customerlist = httpRequest("/customerorder/listofcustomersbystatus?customerstatusid=" + JSON.parse(cmbcustomerstatus.value).id, "GET" );
    fillTable('tblCorder', customerlist, fillForm, btnDeleteMC, viewitem);
}*/

function cmbcutomertypeCH(){
    cotomerbycutomertype=[];
    cmbcustomer.disabled = false;
    cotomerbycutomertype = httpRequest("/customer/listbyCustomertype?customertypeid=" + JSON.parse(cmbcutomertype.value).id, "GET" );
    console.log(cotomerbycutomertype);
    if (corder.customertype_id.name == "Whole"){
        fillCombo3(cmbcustomer, "Select Customer", cotomerbycutomertype, "regno", "companyname", "");

    }else{
        fillCombo3(cmbcustomer, "Select Customer", cotomerbycutomertype, "regno", "fname", "");

    }
    $("#customerselect2parent .select2-container").css('border',initial);

    corder.cpname = null;
    corder.cpmobile = null;
    corder.address = null;

    fullname.innerHTML = "";

    txtcpname.value = "";
    txtcpmobile.value = "";
    txtaddress.value  = "";

    txtcpname.style.border = initial;
    txtcpmobile.style.border = initial;
    txtaddress.style.border = initial;

}

function cmbcustomerCH(){
    if (corder.customertype_id.name == "Rental"){
        var firstname = JSON.parse(cmbcustomer.value).fname;
        var lastname = JSON.parse(cmbcustomer.value).lname;
        var nic = JSON.parse(cmbcustomer.value).nic;
        fullname.innerHTML ="Full Name - " +firstname +" "+ lastname + " | "+" NIC - " +nic;

        txtcpname.value = JSON.parse(cmbcustomer.value).fname;
        txtcpmobile.value = JSON.parse(cmbcustomer.value).mobile;
        txtaddress.value = JSON.parse(cmbcustomer.value).address;
        fillCombo(cmbcities, "Select City", cities, "name", JSON.parse(cmbcustomer.value).cities_id.name);

        corderHasProduct.cpname = txtcpname.value;
        corderHasProduct.address = txtaddress.value;
        corderHasProduct.cities_id = JSON.parse(cmbcities.value);
        console.log(corderHasProduct.cities_id)
        corderHasProduct.cpmobile = txtcpmobile.value;

        txtcpname.style.border = valid;
        txtcpmobile.style.border = valid;
        txtaddress.style.border = valid;
        $("#cityselect2parent .select2-container").css('border',valid);
    }

    if (corder.customertype_id.name == "Whole"){
        txtcpname.value = JSON.parse(cmbcustomer.value).cpname;
        txtcpmobile.value = JSON.parse(cmbcustomer.value).cpmobile;
        txtaddress.value = JSON.parse(cmbcustomer.value).address;
        fillCombo(cmbcities, "Select City", cities, "name", JSON.parse(cmbcustomer.value).cities_id.name);

        corderHasProduct.cpname = txtcpname.value;
        corderHasProduct.cpmobile = txtcpmobile.value;
        corderHasProduct.address = txtaddress.value;
        corderHasProduct.cities_id = JSON.parse(cmbcities.value);

        txtcpname.style.border = valid;
        txtcpmobile.style.border = valid;
        txtaddress.style.border = valid;
        $("#cityselect2parent .select2-container").css('border',valid);

    }
}

function cmbproductCH(){
    txtsalesprice.value = parseFloat(JSON.parse(cmbproduct.value).salesprice).toFixed(2);
    corderHasProduct.salesprice = txtsalesprice.value;
    txtsalesprice.style.border = valid;
}

function linetotalcalculate(){
    if (txtquantity.value!=0){
        txtlinetotal.value = (parseFloat(txtsalesprice.value) * parseFloat(txtquantity.value)).toFixed(2);
        txtlinetotal.style.border = valid;
        if (corderHasProduct!= null && oldcorderHasProduct != null){
            if (corderHasProduct.qty != oldcorderHasProduct.qty){
                txtlinetotal.style.border = updated;
            }else{
                txtlinetotal.style.border = valid;
            }
        }
        corderHasProduct.linetotal =  txtlinetotal.value;

        //if product qty
        if(txtquantity.value >= 3){
            dtarequiredate.disabled = false;
            let today = new Date();
            let afteroneweek = new Date();
            afteroneweek.setDate(today.getDate()+3);
            let month = afteroneweek.getMonth()+1;
            if (month < 10) month = "0" +month; // [0-10]
            let day = afteroneweek.getDate(); // range (1-31)
            if (day < 10) day = "0"+day;
            dtarequiredate.min = afteroneweek.getFullYear()+"-"+month+"-"+day;
        }else{
            dtarequiredate.disabled = false;
            let today = new Date();
            let afteroneweek = new Date();
            afteroneweek.setDate(today.getDate());
            let month = afteroneweek.getMonth()+1;
            if (month < 10) month = "0" +month; // [0-10]
            let day = afteroneweek.getDate(); // range (1-31)
            if (day < 10) day = "0"+day;
            dtarequiredate.min = afteroneweek.getFullYear()+"-"+month+"-"+day;
        }

        if (txtquantity.value > 0 && txtquantity.value < 10){
            txtlinediscount.value = "0";
        }
        if (txtquantity.value >= 10 && txtquantity.value < 40){
            txtlinediscount.value = "4";
        }
        if (txtquantity.value >= 40 && txtquantity.value < 100){
            txtlinediscount.value = "6";
        }
        if (txtquantity.value >= 100 && txtquantity.value < 400){
            txtlinediscount.value = "8";
        }
        if (txtquantity.value >= 400){
            txtlinediscount.value = "10";
        }

        corderHasProduct.linediscount =  txtlinediscount.value;
        txtlinediscount.style.border = valid;

        if (txtquantity.value > parseFloat(txtmaxqty.value)){
            btnInnerAdd.disabled=true;

        }else {
            btnInnerAdd.disabled=false;
        }

    }else {

        swal({
            title: 'Can not Enter..!', icon: "warning",
            text: '\n',
            button: false,
            timer: 1200
        });
        txtquantity.style.border = initial;
        txtquantity.value = "";
        txtquantity.value = "";
        txtquantity.style.border = initial;
        dtarequiredate.style.border = initial;
        corderHasProduct.qty= null;
        txtlinetotal.value = "";
        dtarequiredate.value = "";
        txtlinetotal.style.border = initial;
        corderHasProduct.linetotal= null;
        corderHasProduct.requiredate= null;
        dtarequiredate.disabled = true;

        txtlinediscount.style.border = initial;
        txtlinediscount.value = "";
        corderHasProduct.linediscount= null;
    }

}

function discountcalculate(){
    discontvalue= 0;

    caldiscount = (parseFloat(txttotalamount.value) * txtdiscount.value).toFixed(2) ;
    discontvalue = (parseFloat(caldiscount) / 100).toFixed(2);
    if (discontvalue !=0){
        txtnettotal.value = (parseFloat(txttotalamount.value) - discontvalue).toFixed(2) ;
        txtnettotal.style.border = valid;
        corder.nettotal = txtnettotal.value;
    }else {
        txtnettotal.value = txttotalamount.value;
        txtnettotal.style.border = valid;
        corder.nettotal = txtnettotal.value;
    }


    advancecal();
    advaceamountcalculate();
}

function advaceamountcalculate(){
    advanceamount = txtadvaceamount.value;

    if (advanceamount!=0){
        if (parseFloat(txtnettotal.value) > parseFloat(txtadvaceamount.value )){
            txtbalanceamount.value = (parseFloat(txtnettotal.value) - parseFloat(txtadvaceamount.value)).toFixed(2);
            txtbalanceamount.style.border = valid;
            corder.balanceamount = txtbalanceamount.value;
            console.log(txtbalanceamount.value);
        }else {
            swal({
                title: 'Over The Amount..!', icon: "warning",
                text: '\n',
                button: false,
                timer: 1200
            });
            txtadvaceamount.value = "";
            txtadvaceamount.style.border = initial;
            corder.advaceamount = null;

            corder.balanceamount = null;
            txtbalanceamount.style.border = initial;
            txtbalanceamount.value = "";
        }

    }else {
        txtnettotal.value = "";
        txtbalanceamount.value = "";
        dtrequiredate.value = "";
        txtnettotal.style.border = initial;
        txtbalanceamount.style.border = initial;
        dtrequiredate.style.border = initial;

        corder.requiredate = null;
        corder.nettotal = null;
    }

}

function advancecal(){

    var totalqty = 0;
    for (var innertable in corder.corderHasProductList){
        totalqty = totalqty + corder.corderHasProductList[innertable].qty;
    }
    if (totalqty >= 1){
        corderadvanceamount = txtnettotal.value/2;
        txtadvaceamount.value = parseFloat(corderadvanceamount).toFixed(2)
        txtadvaceamount.style.border = valid;
        corder.advaceamount = txtadvaceamount.value;
        console.log("advance3")
    }
}

function refreshInnerForm() {

    corderHasProduct = new Object();
    oldcorderHasProduct = null;

    corderHasProduct.producttype_id = null;
    corderHasProduct.product_id = null;
    fillCombo(cmbproducttype, "Select Product Type", producttypes, "name", "");
    fillCombo(cmbproduct, "Select Product", products, "productname", "");

    totalamount = 0 ;
    if (corder.corderHasProductList.length!=0){
        for (var index in corder.corderHasProductList){
            totalamount = (parseFloat(totalamount) + parseFloat(corder.corderHasProductList[index].linetotal)).toFixed(2);
        }
        corder.totalamount  = totalamount;
        txttotalamount.value = corder.totalamount;

        if (oldcorder != null && corder.totalamount != oldcorder.totalamount){
            txttotalamount.style.border = updated;
        }else {
            txttotalamount.style.border = valid;
        }
    }else {
        txttotalamount.value = "";
        corder.totalamount = null;
        txttotalamount.style.border = initial;
    }

    cmbproduct.disabled = true;
    cmbproducttype.disabled = false;
    txtsalesprice.disabled = true;
    txtlinetotal.disabled = true;

    btnInnerAdd.disabled = false;
    btnInnerupdate.disabled = true;
    btnInnerClear.disabled = false;
    dtarequiredate.disabled = true;

    corderHasProduct.corderstatus_id = customerorderstatus[0];
    $('#chkDeliver').bootstrapToggle('off');
    innerinitialized();
    fillInnerTable("tblInnerCorder",  corder.corderHasProductList, fillInnerForm, btnInnerDeleteMC, true);

}

function innerinitialized(){
    $("#producttypeselect2parent .select2-container").css('border',initial);
    $("#productselect2parent .select2-container").css('border',initial);

    txtquantity.style.border = initial;
    txtsalesprice.style.border = initial;
    txtlinediscount.style.border = initial;
    txtlinetotal.style.border = initial;
    dtarequiredate.style.border = initial;
    txtcpname.style.border = initial;
    txtcpmobile.style.border = initial;
    txtaddress.style.border = initial;
    $("#cityselect2parent .select2-container").css('border',initial);

    cmbproducttype.value = "";
    txtlinediscount.value = "";
    cmbproduct.value = "";
    txtsalesprice.value = "";
    txtquantity.value = "";
    txtlinetotal.value = "";
    dtarequiredate.value = "";
    txtcpname.value = "";
    txtcpmobile.value = "";
    chkDeliver.value = "";
    txtaddress.value = "";
    cmbcities.value = "";
}

function cmbproducttypeCH(){
    productbyproducttype = httpRequest("product/listbyproducttype?producttypeid=" + JSON.parse(cmbproducttype.value).id, "GET");
    fillCombo(cmbproduct, "Select Product", productbyproducttype, "productname", "");
    cmbproduct.disabled = false;

    var qtycheck = JSON.parse(cmbproducttype.value).maxproductqty_id.qty;
    txtmaxqty.value = qtycheck;
    txtmaxqty.style.border = valid;

    $('#chkDeliver').bootstrapToggle('off')
    $('.collapse').collapse("hide")
    cmbproduct.value = "";
    txtsalesprice.value = "";
    txtquantity.value = "";
    txtlinetotal.value = "";
    dtarequiredate.value = "";

    $("#productselect2parent .select2-container").css('border',initial);
    txtsalesprice.style.border = initial;
    txtquantity.style.border = initial;
    txtlinetotal.style.border = initial;
    dtarequiredate.style.border = initial;
}

function getInnerErrors() {

    var innererrors = "";
    addInnervalue = "";


    if (corderHasProduct.producttype_id == null) {
        innererrors = innererrors + "\n" + "Product Type Not Selected";
        $("#producttypeselect2parent .select2-container").css('border',invalid);
    } else addInnervalue = 1;

    if (corderHasProduct.product_id == null) {
        innererrors = innererrors + "\n" + "Product Not Selected";
        $("#productselect2parent .select2-container").css('border',invalid);
    } else addInnervalue = 1;

    if (corderHasProduct.salesprice == null) {
        innererrors = innererrors + "\n" + "Sale Price Not Enter";
        txtsalesprice.style.border = invalid;
    } else addInnervalue = 1;

    if (corderHasProduct.qty == null) {
        innererrors = innererrors + "\n" + "Quantity Not Enter";
        txtquantity.style.border = invalid;
    } else addInnervalue = 1;

    if (corderHasProduct.linetotal == null) {
        innererrors = innererrors + "\n" + "Line Total Not Enter";
        txtlinetotal.style.border = invalid;
    } else addInnervalue = 1;

    if (corderHasProduct.requiredate == null) {
        innererrors = innererrors + "\n" + "Require Date Not Enter";
        dtarequiredate.style.border = invalid;
    } else addInnervalue = 1;

    if (corderHasProduct.linediscount == null) {
        innererrors = innererrors + "\n" + "Line Discount Not Set";
        txtlinediscount.style.border = invalid;
    } else addInnervalue = 1;

   if( corderHasProduct.delivery == true){
       if (corderHasProduct.cpname == null) {
           innererrors = innererrors + "\n" + "Contact Person Name Not Enter";
           txtcpname.style.border = invalid;
       } else addInnervalue = 1;

       if (corderHasProduct.cpmobile == null) {
           innererrors = innererrors + "\n" + "Contact Number Not Enter";
           txtcpmobile.style.border = invalid;
       } else addInnervalue = 1;

       if (corderHasProduct.address == null) {
           innererrors = innererrors + "\n" + "Address Not Enter";
           txtaddress.style.border = invalid;
       } else addInnervalue = 1;


       if (corderHasProduct.cities_id == null) {
           innererrors = innererrors + "\n" + "City Not Selected";
           $("#cityselect2parent .select2-container").css('border',invalid);
       } else addInnervalue = 1;
   }

    return innererrors;

}

function btnInnerAddMc() {

    if ( getInnerErrors()==""){
        var matext = false;
        for (var index in corder.corderHasProductList) {
            if (corder.corderHasProductList[index].product_id.productname == corderHasProduct.product_id.productname) {
                matext = true;
                break;
            }
        }
        if (matext) {
            swal({
                title: 'Already Excited..!', icon: "warning",
                text: '\n',
                button: false,
                timer: 1200
            });
        } else {

            var totallineamount = 0 ;
            if (corder.corderHasProductList.length != 0){
                for (var index in corder.corderHasProductList){
                    totallineamount = parseFloat(totallineamount) + parseFloat(corder.corderHasProductList[index].linetotal);
                }
            }
            txttotalamount.value = (parseFloat(totallineamount) + parseFloat(corderHasProduct.linetotal)).toFixed(2);
            corder.totalamount = txttotalamount.value;

            corder.corderHasProductList.push(corderHasProduct);

            // set the date of product to closer date
            let innerrequiredate = new Date(dtarequiredate.value); // inner Require date
            let mainrequiredate = new Date(dtrequiredate.value); // Main Require Date
            console.log(innerrequiredate);
            if (dtrequiredate.value!="" && mainrequiredate.getTime() > innerrequiredate.getTime()){
                dtrequiredate.value = dtarequiredate.value;
                dtrequiredate.style.border = valid;
                corder.requiredate = dtarequiredate.value;

            }else if(dtrequiredate.value=="") {
                dtrequiredate.value = dtarequiredate.value;
                dtrequiredate.style.border = valid;
                corder.requiredate = dtarequiredate.value;

            }

            refreshInnerForm();
            clearDNAB();// Discount, Net Total, Advance Amount, Balance Amount clear this fields
            totallinediscount = 0;
            for (var alldiscount in corder.corderHasProductList){
                var totallinediscount = parseFloat(totallinediscount) + parseFloat(corder.corderHasProductList[alldiscount].linediscount);
            }

            console.log(totallinediscount)
            txtdiscount.value = totallinediscount;
            corder.discountrate =  txtdiscount.value;
            txtdiscount.style.border = valid;

            discountcalculate();
        }
    }else {
        swal({
            title: "You have following errors",
            text: "\n"+getInnerErrors(),
            icon: "error",
            button: true,
        });
    }

}

// Discount, Net Total, Advance Amount, Balance Amount clear this fields when add new product in Inner form
function clearDNAB(){

    txtdiscount.value = "";
    txtnettotal.value = "";
    txtadvaceamount.value = "";

    txtdiscount.style.border = initial;
    txtnettotal.style.border = initial;
    txtadvaceamount.style.border = initial;
    txtbalanceamount.style.border = initial;

    corder.nettotal = null;
    corder.discountrate = null;
    corder.advaceamount = null;
    corder.balanceamount = null;
}

function getInnerUpdates() {

    var innerupdates = "";

    if(corderHasProduct !=null && oldcorderHasProduct != null) {
        if (corderHasProduct.producttype_id.name != oldcorderHasProduct.producttype_id.name)
            innerupdates = innerupdates + "\nProduct Type Changed.." + oldcorderHasProduct.producttype_id.name + " into " + corderHasProduct.producttype_id.name;

        if (corderHasProduct.product_id.productname != oldcorderHasProduct.product_id.productname)
            innerupdates = innerupdates + "\nProduct Changed.." + oldcorderHasProduct.product_id.productname + " into " + corderHasProduct.product_id.productname;

        if (corderHasProduct.salesprice != oldcorderHasProduct.salesprice)
            innerupdates = innerupdates + "\nSales Price Change.." + oldcorderHasProduct.salesprice + " into " + corderHasProduct.salesprice;

        if (corderHasProduct.qty != oldcorderHasProduct.qty)
            innerupdates = innerupdates + "\nQuantity Changed.." + oldcorderHasProduct.qty + " into " + corderHasProduct.qty;

        if (corderHasProduct.linetotal != oldcorderHasProduct.linetotal)
            innerupdates = innerupdates + "\nLine Total Changed.." + oldcorderHasProduct.linetotal + " into " + corderHasProduct.linetotal;

        if (corderHasProduct.requiredate != oldcorderHasProduct.requiredate)
            innerupdates = innerupdates + "\nRequire Date Changed.." + oldcorderHasProduct.requiredate + " into " + corderHasProduct.requiredate;

        if (corderHasProduct.delivery != oldcorderHasProduct.delivery)
            innerupdates = innerupdates + "\nDelivery Changed.." + oldcorderHasProduct.delivery + " into " + corderHasProduct.delivery;

        if (corderHasProduct.delivery == true){
            if (corderHasProduct.cpname != oldcorderHasProduct.cpname)
                innerupdates = innerupdates + "\nContact Person name Changed..";

            if (corderHasProduct.cpmobile != oldcorderHasProduct.cpmobile)
                innerupdates = innerupdates + "\nContact Person Mobile Changed..";

            if (corderHasProduct.address != oldcorderHasProduct.address)
                innerupdates = innerupdates + "\nAddress is Changed..";
        }


    }
    return innerupdates;
}

function viewInnerOrderProduct(){
}

function fillInnerForm(co, innerrowno) {

    innerrow = innerrowno;
    corderHasProduct = JSON.parse(JSON.stringify(co));
    oldcorderHasProduct = JSON.parse(JSON.stringify(co));

    txtsalesprice.value = parseFloat(corderHasProduct.salesprice).toFixed(2);
    txtquantity.value = corderHasProduct.qty;
    txtlinetotal.value = parseFloat(corderHasProduct.linetotal).toFixed(2);
    dtarequiredate.value = corderHasProduct.requiredate;
    if (corderHasProduct.delivery == true){
        $('#chkDeliver').bootstrapToggle('on')
    }

    if (oldcorderHasProduct !=null && corderHasProduct.delivery ==true){
        txtcpname.value = corderHasProduct.cpname;
        txtcpmobile.value = corderHasProduct.cpmobile;
        txtaddress.value = corderHasProduct.address;

        txtcpname.style.border = valid;
        txtcpmobile.style.border = valid;
        txtaddress.style.border = valid;
    }else {
        corderHasProduct.cpname = null;
        corderHasProduct.cpmobile = null;
        corderHasProduct.address = null;

    }

    fillCombo(cmbproducttype, "Select Product Type", producttypes, "name", corderHasProduct.producttype_id.name);

    productbyproducttype = httpRequest("product/listbyproducttype?producttypeid=" + JSON.parse(cmbproducttype.value).id, "GET");
    fillCombo(cmbproduct, "Select Product", productbyproducttype, "productname", corderHasProduct.product_id.productname);

    cmbproducttype.disabled = true;
    cmbproduct.disabled = true;

    txtsalesprice.style.border = valid;
    txtquantity.style.border = valid;
    txtlinetotal.style.border = valid;
    dtarequiredate.style.border = valid;
    chkDeliver.style.border = valid;

    btnInnerAdd.disabled = true;
    btnInnerupdate.disabled = false;
    btnInnerClear.disabled = false;
}

function btnInnerupdateMc(){

    var innerupdate = getInnerUpdates();
    if (innerupdate == ""){
        swal({
            className:"innermasserposition",
            text: '\n Nothing Updated..!',
            button: false,
            timer: 1200
        });
    }else {
        if (getInnerErrors()==""){

            swal({
                title: "Are you sure to update following Order product details...?",
                text: "\n"+ getInnerUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        corder.corderHasProductList[innerrow] = corderHasProduct;
                        refreshInnerForm();
                        clearDNAB();
                        btnInnerupdate.disabled=true;
                        quantity = 0;
                        for (var allqty in corder.corderHasProductList){
                            var quantity = parseFloat(quantity) + parseFloat(corder.corderHasProductList[allqty].qty);
                        }
                        if (quantity > 0 && quantity < 10){txtdiscount.value="0";}
                        if (quantity >= 10 && quantity < 50){txtdiscount.value="2";}
                        if (quantity >= 50 && quantity < 100){txtdiscount.value="4";}
                        if (quantity >= 100 && quantity < 250){txtdiscount.value="7";}
                        if (quantity >= 250 && quantity < 500){txtdiscount.value="8";}
                        if (quantity >= 500 && quantity < 1000){txtdiscount.value="10";}
                        if (quantity >= 1000){txtdiscount.value="15";}
                        console.log(quantity);
                        corder.discountrate=txtdiscount.value;
                        txtdiscount.style.border = valid;
                        discountcalculate();
                    }
                });

        }else{
            swal({
                title: "You have following errors",
                text: "\n"+getInnerErrors(),
                icon: "error",
                button: true,
            });

        }
    }
}

function btnInnerDeleteMC(innerob, innerrow) {

    swal({
        title: "Are you sure to Delete following Product Order...?",

        text: "\nProduct Type :" + innerob.producttype_id.name,
        icon: "warning", buttons: true, dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                corder.corderHasProductList.splice(innerrow, 1)
                refreshInnerForm();
                clearDNAB();
                discountcalculate();
            }
        });

}

function btnInnerclearMc() {
    //Get Cofirmation from the User window.confirm();
    addInnervalue = getInnerErrors();

    if (oldcorderHasProduct == null && addInnervalue == "") {
        refreshInnerForm();
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the Inner form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                refreshInnerForm();
            }

        });
    }

}

function viewInnerData() {
}

function setStyle(style) {

    $("#customerselect2parent .select2-container").css('border',style);
    $("#producttypeselect2parent .select2-container").css('border',style);
    $("#productselect2parent .select2-container").css('border',style);
    $("#cityselect2parent .select2-container").css('border',style);
    cmbcutomertype.style.border = style;
    cmbcustomer.style.border = style;
    dtrequiredate.style.border = style;
    dtaaddeddate.style.border = style;
    txttotalamount.style.border = style;
    txtdiscount.style.border = style;
    txtnettotal.style.border = style;
    txtadvaceamount.style.border = style;
    txtbalanceamount.style.border = style;
    cmbcorderstatus.style.border = style;
    cmbemployee.style.border = style;
    txtDescription.style.border = style;

}

function disableButtons(add, upd, del) {

    if (add || !privilages.add) {
        btnAdd.setAttribute("disabled", "disabled");
        $('#btnAdd').css('cursor', 'not-allowed');
    } else {
        btnAdd.removeAttribute("disabled");
        $('#btnAdd').css('cursor', 'pointer')
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

    // select deleted data row
    for (index in corders) {
        if (corders[index].corderstatus_id.name == "Deleted") {
            tblCorder.children[1].children[index].style.color = "#f00";
            tblCorder.children[1].children[index].style.border = "2px solid red";
            tblCorder.children[1].children[index].lastChild.children[1].disabled = true;
            tblCorder.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (corder.cordercode == null) {
        errors = errors + "\n" + "Customer Order Number Not Enter";
        txtcordernmb.style.border = invalid;
    } else addvalue = 1;

    if (corder.customertype_id == null) {
        errors = errors + "\n" + "Customer Type Not Seleted";
        cmbcutomertype.style.border = invalid;
    } else addvalue = 1;

    if (corder.customer_id == null) {
        errors = errors + "\n" + "Customer Not Seleted";
        $("#customerselect2parent .select2-container").css('border',invalid);
    } else addvalue = 1;

    if (corder.requiredate == null) {
        errors = errors + "\n" + "Require Date Not Enter";
        dtrequiredate.style.border = invalid;
    } else addvalue = 1;

    if (corder.employee_id == null) {
        errors = errors + "\n" + "Employee Not Seleted";
        cmbemployee.style.border = invalid;
    } else addvalue = 1;

    if (corder.corderstatus_id == null) {
        errors = errors + "\n" + "Status Not Seleted";
        cmbcorderstatus.style.border = invalid;
    } else addvalue = 1;

    if (corder.totalamount == null) {
        errors = errors + "\n" + "Total Amount Not Seleted";
        txttotalamount.style.border = invalid;
    } else addvalue = 1;

    if (corder.discountrate == null) {
        errors = errors + "\n" + "Discount Rate Not Enter";
        txtdiscount.style.border = invalid;
    } else addvalue = 1;

    if (corder.nettotal == null) {
        errors = errors + "\n" + "Net Total Not Enter";
        txtnettotal.style.border = invalid;
    } else addvalue = 1;

    if (corder.advaceamount == null) {
        errors = errors + "\n" + "Advance Amount Not Enter";
        txtadvaceamount.style.border = invalid;
    } else addvalue = 1;

    if (corder.balanceamount == null) {
        errors = errors + "\n" + "Balance Amount Not Enter";
        txtbalanceamount.style.border = invalid;
    } else addvalue = 1;

    if (corder.corderHasProductList.length == 0) {
        errors = errors + "\n" + "Product Form Can not be Empty";
    } else addvalue = 1;
    
    return errors;

}

function btnAddMC(){
    if(getErrors()==""){
        if(txtDescription.value ==""){
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
        title: "Are you sure to add following Customer Order...?",
        text: "\nCustomer Type : " + corder.customertype_id.name +
            "\nCustomer Code : " + corder.cordercode +
            "\nCustomer Reg No : " + corder.customer_id.regno +
            "\nRequire Date : " + corder.requiredate +
            "\nAdded Date : " + corder.addeddate +
            "\nEmployee Name : " + corder.employee_id.callingname +
            "\nStatus : " + corder.corderstatus_id.name +
            "\nTotal Amount : " + corder.totalamount +
            "\nDiscount Rate: " + corder.discountrate +
            "\nNet Total : " + corder.nettotal +
            "\nAdvance Total : " + corder.advaceamount +
            "\nBalance Amount : " + corder.balanceamount,


        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/customerorder", "POST", corder);
            if (response == "0") {
                swal({
                    position: 'center',
                    icon: 'success',
                    title: 'Your work has been Done \n Save SuccessFully..!',
                    text: '\n',
                    button: false,
                    timer: 1200
                });
                activepage = 1;
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

    if (oldcorder == null && addvalue == "") {
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

function fillForm(cus, rowno) {
    activerowno = rowno;

    if (oldcorder == null) {
        filldata(cus);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(cus);
            }

        });
    }

}

function filldata(cus) {
    clearSelection(tblCorder);
    selectRow(tblCorder, activerowno, active);

    corder = JSON.parse(JSON.stringify(cus));
    oldcorder = JSON.parse(JSON.stringify(cus));

    txtcordernmb.value = corder.cordercode;
    dtrequiredate.value = corder.requiredate;
    dtaaddeddate.value = corder.addeddate;
    txtDescription.value = corder.description;
    txttotalamount.value = parseFloat(corder.totalamount).toFixed(2);
    txtdiscount.value = corder.discountrate;
    txtnettotal.value = parseFloat(corder.nettotal).toFixed(2);
    txtadvaceamount.value = parseFloat(corder.advaceamount).toFixed(2);
    txtbalanceamount.value = parseFloat(corder.balanceamount).toFixed(2);


    fillCombo(cmbcorderstatus, "Select Status", customerorderstatus, "name", corder.corderstatus_id.name);
    fillCombo(cmbcutomertype, "Select Status", customertypes, "name", corder.customertype_id.name);

    cotomerbycutomertype = httpRequest("/customer/listbyCustomertype?customertypeid=" + JSON.parse(cmbcutomertype.value).id, "GET" );
    console.log(cotomerbycutomertype);
    if (corder.customertype_id.name == "Whole"){
        fillCombo3(cmbcustomer, "Select Customer", cotomerbycutomertype, "regno", "companyname", corder.customer_id.regno);
    }else{
        fillCombo3(cmbcustomer, "Select Customer", cotomerbycutomertype, "regno", "fname", corder.customer_id.regno);
    }
    fillCombo(cmbemployee, "Select Employeee", employees, "callingname", corder.employee_id.callingname);
    cmbcorderstatus.disabled = false;
    cmbcustomer.disabled = false;

    disableButtons(true, false, false);
    setStyle(valid);

      //check null statements
    if (corder.txtDescription == null){
        txtDescription.style.border = initial;
    }

    if (corderHasProduct.cpname == null){
        txtcpname.style.border = initial;
    }
    if (corderHasProduct.cpmobile == null){
        txtcpmobile.style.border = initial;
    }
    if (corderHasProduct.address == null){
        txtaddress.style.border = initial;
    }

    refreshInnerForm();
    $('#formmodel').modal('show')
/**/

}

function getUpdates() {

    var updates = "";

    if (corder != null && oldcorder != null) {

        if (corder.cordercode != oldcorder.cordercode)
            updates = updates + "\n Corder Code is Changed.." + oldcorder.cordercode + " into " + corder.cordercode;

        if (corder.customertype_id.name != oldcorder.customertype_id.name)
            updates = updates + "\nCustomer Type is Changed.." + oldcorder.customertype_id.name + " into " + corder.customertype_id.name;

        if (corder.customer_id.name != oldcorder.customer_id.name)
            updates = updates + "\nCustomer Name is Changed.." + oldcorder.customer_id.name + " into " + corder.customer_id.name;

        if (corder.requiredate != oldcorder.requiredate)
            updates = updates + "\nRequire Date is Changed.." + oldcorder.requiredate + " into " + corder.requiredate;

        if (corder.addeddate != oldcorder.addeddate)
            updates = updates + "\nAdded Date is Changed.." + oldcorder.addeddate + " into " + corder.addeddate;

        if (corder.description != oldcorder.description)
            updates = updates + "\nDescription is Changed..";

        if (corder.employee_id.callingname != oldcorder.employee_id.callingname)
            updates = updates + "\nEmployee is changed.." + oldcorder.employee_id.callingname + " into " + corder.employee_id.callingname;

        if (corder.bankname != oldcorder.bankname)
            updates = updates + "\nBank Name is Changed.." + oldcorder.bankname + " into " + corder.bankname;

        if (corder.corderstatus_id.name != oldcorder.corderstatus_id.name)
            updates = updates + "\nStatus is Changed.." + oldcorder.corderstatus_id.name + " into " + corder.corderstatus_id.name;

        if (corder.totalamount != oldcorder.totalamount)
            updates = updates + "\nTotal Amount is Changed.." + oldcorder.totalamount + " into " + corder.totalamount;

        if (corder.discountrate != oldcorder.discountrate)
            updates = updates + "\nDiscount Rate is Changed.." + oldcorder.discountrate + " into " + corder.discountrate;

        if (isEqual(corder.corderHasProductList, oldcorder.corderHasProductList , 'producttype_id'))
            updates = updates + "\nProduct Order is Changed..";

        if (corder.nettotal != oldcorder.nettotal)
            updates = updates + "\nNet Total is Changed.." + oldcorder.nettotal + " into " + corder.nettotal;

        if (corder.advaceamount != oldcorder.advaceamount)
            updates = updates + "\nAdvance Amount is Changed.." + oldcorder.advaceamount + " into " + corder.advaceamount;

        if (corder.balanceamount != oldcorder.balanceamount)
            updates = updates + "\nBalance Amount is Changed.." + oldcorder.balanceamount + " into " + corder.balanceamount;

        if (corder.paidamount != oldcorder.paidamount)
            updates = updates + "\nPaid Amount is Changed.." + oldcorder.paidamount + " into " + corder.paidamount;

    }

    return updates;

}

function btnUpdateMC() {
    var errors = getErrors();
    if (errors == "") {
        var updates = getUpdates();
        if (updates == "")
            swal({
                title: 'Nothing Updated..!',icon: "warning",
                text: '\n',
                button: false,
                timer: 1200});
        else {
            swal({
                title: "Are you sure to update following Customer Product details...?",
                text: "\n"+ getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/customerorder", "PUT", corder);
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
                            $('#formmodel').modal('hide');

                        }
                        else
                            swal({
                                title: 'Failed to Update as',icon: "error",
                                text: '\n '+ response,
                                button: true
                            });
                    }
                });
        }
    }
    else
        swal({
            title: 'You have following errors in your form',icon: "error",
            text: '\n '+getErrors(),
            button: true
        });

}

function btnDeleteMC(co) {
    corder = JSON.parse(JSON.stringify(co));

    swal({
        title: "Are you sure to delete following Customer Order...?",
        text: "\n Supplier Number : " + corder.cordercode +
            "\n Company Name  : " + corder.customertype_id.name,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/customerorder", "DELETE", corder);
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
    disableButtons(false, true, true);

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
    formattab = tblSupplier.outerHTML;

    //write the table for the new open tab
    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 50px; '> <h1>Customer Order Details : </h1></div>" +
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
        loadForm();
    }else
        swal({
            title: "Do want to close the model...?",
            icon: "warning", buttons: true, dangerMode: true,
            className: "swal-button",
        }).then((willDelete) => {
            if (willDelete) {
                $('#formmodel').modal('hide')
                loadForm();
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

function checkBoxBinder(){

    if (chkDeliver.checked){
        corderHasProduct.delivery = true;
        $('.collapse').collapse("show")

    }else {
        corderHasProduct.delivery = false;
        $('.collapse').collapse("hide")

    }

    if (cmbcustomer.value != ""){
      if (corder.corderHasProductList.length != 0){

          txtcpname.value = JSON.parse(cmbcustomer.value).fname;
          txtcpmobile.value = JSON.parse(cmbcustomer.value).mobile;
          txtaddress.value = JSON.parse(cmbcustomer.value).address;
          fillCombo(cmbcities, "Select City", cities, "name", JSON.parse(cmbcustomer.value).cities_id.name);
          $("#cityselect2parent .select2-container").css('border',valid);

          corderHasProduct.cpname = txtcpname.value;
          corderHasProduct.cpmobile = txtcpmobile.value;
          corderHasProduct.address = txtaddress.value;
          corderHasProduct.cities_id = JSON.parse(cmbcities.value);

          txtcpname.style.border = valid;
          txtcpmobile.style.border = valid;
          txtaddress.style.border = valid;

      }
    }
}
