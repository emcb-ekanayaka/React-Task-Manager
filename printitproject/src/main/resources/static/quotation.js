window.addEventListener("load", initialize);

//Initializing Functions

function initialize() {
    $('[data-toggle="tooltip"]').tooltip()

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    txtSearchName.addEventListener("keyup", btnSearchMC);
    cmbSupplier.addEventListener("change",cmbSupplierCH);
    //cmbqrequest.addEventListener("change",cmbqrequestCH);

    $('.js-example-basic-single').select2();
    privilages = httpRequest("../privilage?module=QUOTATION", "GET");

    //data list for form combo
    suppliers = httpRequest("../supplier/list","GET");
    quotationrequests = httpRequest("../quotationrequest/list", "GET");
    quotationstatus = httpRequest("../quotationstatus/list", "GET");
    employees = httpRequest("../employee/list", "GET");

    //inner form
    qmaterials = httpRequest("../material/list", "GET");

    valid = "2px solid #006400";
    invalid = "2px solid red";
    initial = "2px solid #d6d6c2";
    updated = "2px solid #ff9900";
    active = "#ff9900";

    //refresh View Side
    loadView();

    //refresh form Side
    loadForm();
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
    quotations = new Array();
    var data = httpRequest("/quotation/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) quotations = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblQuotation', quotations, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblQuotation);

    if (activerowno != "") selectRow(tblQuotation, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldquotation == null) {
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

function viewitem(quo, rowno) {

    quotationview = JSON.parse(JSON.stringify(quo));

    tblquotationnumber.innerHTML =  quotationview.qno;
    tblQrequest.innerHTML =  quotationview.quotationrequest_id.qrno;
    tblSupplier.innerHTML =  quotationview.supplier_id.companyname;
    tblReceivedDate.innerHTML =  quotationview.reciveddate;
    tblValidTo.innerHTML =  quotationview.validto;
    tblValidFrom.innerHTML = quotationview.validfrom;

    tblAddeddate.innerHTML = quotationview.addeddate;
    tblStatus.innerHTML = quotationview.quotationstatus_id.name;
    tblEmployee.innerHTML = quotationview.employee_id.callingname;


    if (quotationview.description!=null){
        tblDescription.innerHTML = quotationview.description;
    }
    fillInnerTable("tblPrintInnerMaterial",quotationview.quotationHasMaterialList, fillInnerForm, btnInnerDeleteMC, viewInnerMaterial)
    $('#quotationmodal').modal('show')

}

function btnPrintrow() {

    var format = printformtable.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'></head>" +
        "<body><div style='margin-top: 150px'><h1>Quotation Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);

}

function loadForm() {
    quotation = new Object();
    oldquotation = null;

    //create array List
    quotation.quotationHasMaterialList = new Array();

    fillCombo(cmbSupplier,"Select Supplier",suppliers,"companyname","");
    fillCombo(cmbqrequest, "Select Quotation Request", quotationrequests, "qrno", "");
    fillCombo(cmbstatus, "Select Status", quotationstatus, "name", "Valid");
    fillCombo(cmbemployee, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    quotation.employee_id = JSON.parse(cmbemployee.value);
    cmbemployee.disabled = true;
    quotation.quotationstatus_id = JSON.parse(cmbstatus.value);
    cmbstatus.disabled = true;

    dtvalidto.value = "";
    dtvalidfrom.value = "";
    txtdescription.value = "";

    //Added date Field
    dtaaddeddate.value= getCurrentDateTime("date");
    quotation.addeddate = dtaaddeddate.value;
    dtaaddeddate.disabled = true;
    dtaaddeddate.style.border = valid;

    // Get Next Number Form Data Base
    var nextNumber = httpRequest("/quotation/nextNumber", "GET");
    txtqn.value = nextNumber.qno;
    quotation.qno = txtqn.value;
    txtqn.disabled="disabled";
    txtqn.style.border = valid;

    // Received Date
    dtreceiveddate.max = getCurrentDateTime("date");
    let roday = new Date();
    let rafteroneweek = new Date();
    rafteroneweek.setDate(roday.getDate()-7);
    let rmonth = rafteroneweek.getMonth()+1;
    if (rmonth < 10) rmonth = "0" +rmonth;
    let rday = rafteroneweek.getDate();
    if (rday < 10) rday = "0"+rday;
    dtreceiveddate.min = rafteroneweek.getFullYear()+"-"+rmonth+"-"+rday;


    // Valid From
    dtvalidfrom.min = getCurrentDateTime("date");
    let today = new Date();
    let btoday = new Date();
    let afteroneweek = new Date();
    let beforeonweek = new Date();
    beforeonweek.setDate(btoday.getDate()-7);
    let bmonth = beforeonweek.getMonth()+1;
    if (bmonth < 10) bmonth = "0" +bmonth;
    let bday = beforeonweek.getDate();
    if (bday < 10) bday = "0"+bday;
    afteroneweek.setDate(today.getDate()+7);
    let month = afteroneweek.getMonth()+1;
    if (month < 10) month = "0" +month;
    let day = afteroneweek.getDate();
    if (day < 10) day = "0"+day;
    dtvalidfrom.max = afteroneweek.getFullYear()+"-"+month+"-"+day;
    dtvalidfrom.min = beforeonweek.getFullYear()+"-"+bmonth+"-"+bday;


    // Valid To
    dtvalidto.min = getCurrentDateTime("date");
    let voday = new Date();
    let vafteroneweek = new Date();
    vafteroneweek.setDate(voday.getDate()+365);
    let vmonth = vafteroneweek.getMonth()+1;
    if (vmonth < 10) vmonth = "0" +vmonth;
    let vday = vafteroneweek.getDate();
    if (vday < 10) vday = "0"+vday;
    dtvalidto.max = vafteroneweek.getFullYear()+"-"+vmonth+"-"+vday;


    setStyle(initial);
    cmbstatus.style.border = valid;
    cmbemployee.style.border = valid;

    cmbSupplier.disabled=false;
    cmbqrequest.disabled = true;
    btnInnerClear.disabled = true;
    btnInnerupdate.disabled = true;
    disableButtons(false, true, true);
    refreshInnerForm();
}

//Quotation Request Code will be Change When Supplier selected
function cmbSupplierCH(){

    if (cmbSupplier.value !=""){
        changequotationrequestbysupplier = httpRequest("/quotationrequest/listbyquotationrequest?supplierid=" + JSON.parse(cmbSupplier.value).id, "GET");
        fillCombo(cmbqrequest, "Select Quotation Request", changequotationrequestbysupplier, "qrno", "");
        cmbqrequest.disabled = false;
        quotation.quotationHasMaterialList = new Array();
        refreshInnerForm();
        fillCombo(cmbmaterial, "Select Material", qmaterials, "materialname", "");
        $("#quatationselect2parent .select2-container").css('border',initial);
        $("#materialselect2parent .select2-container").css('border',initial);
    }

}


function refreshInnerForm() {

    quotationhasmaterial = new Object();
    oldquotationhasmaterial = null;

    if(cmbqrequest.value !=""){
        fillCombo(cmbmaterial, "Select Material", materialByQuotationRequest, "materialname", "");
        cmbmaterial.disabled = false;
        pprice.disabled = false;
        maxquantity.disabled = false;
        minquantity.disabled = false;
        btnInnerAdd.disabled = false;
    }else {
        fillCombo(cmbmaterial, "Select Material", qmaterials, "materialname", "");
        cmbmaterial.disabled = true;
        pprice.disabled = true;
        maxquantity.disabled = true;
        minquantity.disabled = true;
        btnInnerAdd.disabled = true;
        btnInnerupdate.disabled = true;
    }

    $("#materialselect2parent .select2-container").css('border',initial);
    pprice.style.border = initial;
    maxquantity.style.border = initial;
    minquantity.style.border = initial;

    cmbmaterial.value="";
    pprice.value="";
    maxquantity.value="";
    minquantity.value="";

    fillInnerTable("tblInnerMaterial", quotation.quotationHasMaterialList, fillInnerForm, btnInnerDeleteMC, viewInnerMaterial);

}

// Material Name field Will Be Enable And list material when quotation request No Selected
function cmbqrequestCH(){

    materialByQuotationRequest = httpRequest("/material/listByMaterial?quotationrequestid=" + JSON.parse(cmbqrequest.value).id, "GET");
    fillCombo(cmbmaterial, "Select Material", materialByQuotationRequest, "materialname", "");
    quotation.quotationHasMaterialList = new Array();
    refreshInnerForm();
    btnInnerClear.disabled = false;
    $("#materialselect2parent .select2-container").css('border',initial);

}

function checkinnerempty(){
    var error = "";

    if (quotationhasmaterial.material_id == null){
        error = error + "\n" + "Select A Material...!";
        cmbmaterial.style.border = invalid;
    }

    if (quotationhasmaterial.purchaseprice == null){
        error = error + "\n" + "Please Enter Purchaseprice...!";
        pprice.style.border = invalid;
    }
    return error;

}
function btnInnerclearMc(){

    swal("Clear Inner Form?", {
        className:"innermasserposition",
        dangerMode: true,
        buttons: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                refreshInnerForm();
                btnInnerupdate.disabled=true;
            }
        });

}

function btnInnerAddMc() {

    if (checkinnerempty()==""){

        let matext = false;
        for (let index in quotation.quotationHasMaterialList) {
            if (quotation.quotationHasMaterialList[index].material_id.materialname == quotationhasmaterial.material_id.materialname) {
                matext = true;
                break;
            }
        }
        if (matext) {
            swal({
                title: 'Material Name Already Excited..!', icon: "warning",
                text: '\n',
                button: false,
                timer: 1200
            });
        } else {

            quotation.quotationHasMaterialList.push(quotationhasmaterial);
            refreshInnerForm();
        }
    }else{
        swal({
            title: "You have following errors",
            text: "\n"+checkinnerempty(),
            icon: "error",
            button: true,
        });

    }


}
function getInnerUpdates() {

    var innerupdates = "";

    if(quotationhasmaterial !=null && oldquotationhasmaterial!=null) {
        if (quotationhasmaterial.purchaseprice != oldquotationhasmaterial.purchaseprice)
            innerupdates = innerupdates + "\nQuantity Changed.." + oldquotationhasmaterial.purchaseprice + " into " + quotationhasmaterial.purchaseprice;

        if (quotationhasmaterial.minqty != oldquotationhasmaterial.minqty)
            innerupdates = innerupdates + "\nQuantity Changed.." + oldquotationhasmaterial.minqty + " into " + quotationhasmaterial.minqty;

        if (quotationhasmaterial.maxqty != oldquotationhasmaterial.maxqty)
            innerupdates = innerupdates + "\nQuantity Changed.." + oldquotationhasmaterial.maxqty + " into " + quotationhasmaterial.maxqty;
    }
    return innerupdates;
}

function fillInnerForm(obqo, innrrowno) {
    innerrow = innrrowno;
    quotationhasmaterial = JSON.parse(JSON.stringify(obqo));
    oldquotationhasmaterial = JSON.parse(JSON.stringify(obqo));
    btnInnerupdate.disabled = false;
    btnInnerAdd.disabled = true;

    fillCombo(cmbmaterial, "Select Material", materialByQuotationRequest, "materialname", quotationhasmaterial.material_id.materialname);
    cmbmaterial.disabled = true;
    $("#materialselect2parent .select2-container").css('border',valid);
    pprice.value = parseFloat(quotationhasmaterial.purchaseprice).toFixed(2);
    pprice.style.border = valid;
    minquantity.value = quotationhasmaterial.minqty;
    minquantity.disabled = false;
    minquantity.style.border = valid;

    maxquantity.value = quotationhasmaterial.maxqty;
    maxquantity.disabled = false;
    maxquantity.style.border = valid;

    if (oldquotationhasmaterial != null && oldquotationhasmaterial.purchaseprice ==null){
        pprice.style.border = initial;
        pprice.value="";
    }
    if (oldquotationhasmaterial != null && oldquotationhasmaterial.minqty ==null){
        minquantity.style.border = initial;
        minquantity.value="";
    }
    if (oldquotationhasmaterial != null && oldquotationhasmaterial.maxqty ==null){
        maxquantity.style.border = initial;
        maxquantity.value="";
    }

    btnInnerClear.disabled = false;
    btnInnerupdate.disabled=false;
    btnInnerAdd.disabled=true;
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
        if (checkinnerempty()==""){

            quotation.quotationHasMaterialList[innerrow] = quotationhasmaterial;
            refreshInnerForm();
            btnInnerupdate.disabled=true;

        }else{
            swal({
                title: "You have following errors",
                text: "\n"+checkinnerempty(),
                icon: "error",
                button: true,
            });

        }
    }


}

function btnInnerDeleteMC(innerob, innerrow) {

    swal({
        title: "Are you sure to Delete following material...?",

        text: "\nMaterial Name :" + innerob.material_id.materialname,
        icon: "warning", buttons: true, dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                quotation.quotationHasMaterialList.splice(innerrow, 1)
                refreshInnerForm();
            }
        });

}

function viewInnerMaterial() {

}

function setStyle(style) {

    $("#quatationselect2parent .select2-container").css('border',style);
    cmbSupplier.style.border = style;
    cmbqrequest.style.border = style;
    dtreceiveddate.style.border = style;
    dtvalidto.style.border = style;
    dtvalidfrom.style.border = style;
    txtdescription.style.border = style;
    cmbstatus.style.border = style;
    cmbemployee.style.border = style;

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
    for (index in quotations) {
        if (quotations[index].quotationstatus_id.name == "Deleted") {
            tblQuotation.children[1].children[index].style.color = "#f00";
            tblQuotation.children[1].children[index].style.border = "2px solid red";
            tblQuotation.children[1].children[index].lastChild.children[1].disabled = true;
            tblQuotation.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (quotation.qno == null) {
        errors = errors + "\n" + "Quotation Number Not Enter";
        txtqn.style.border = invalid;
    } else addvalue = 1;

    if (quotation.quotationrequest_id == null) {
        errors = errors + "\n" + "quotation Request Not Selected";
        cmbqrequest.style.border = invalid;
    } else addvalue = 1;

    if (quotation.supplier_id == null) {
        errors = errors + "\n" + "Supplier Not Selected";
        cmbSupplier.style.border = invalid;
    } else addvalue = 1;

    if (quotation.reciveddate == null) {
        errors = errors + "\n" + "Received Date Not Enter";
        dtreceiveddate.style.border = invalid;
    } else addvalue = 1;

    if (quotation.validto == null) {
        errors = errors + "\n" + "Valid Date Not Selected";
        dtvalidto.style.border = invalid;
    } else addvalue = 1;

    if (quotation.validfrom == null) {
        errors = errors + "\n" + "Lan Number Not Enter";
        dtvalidfrom.style.border = invalid;
    } else addvalue = 1;

    if (quotation.addeddate == null) {
        errors = errors + "\n" + "Added Date Not Enter";
        dtaaddeddate.style.border = invalid;
    } else addvalue = 1;

    if (quotation.quotationstatus_id == null) {
        errors = errors + "\n" + "quotation Status Not Selected";
        cmbquotationStatus.style.border = invalid;
    } else addvalue = 1;

    if (quotation.employee_id.callingname == null) {
        errors = errors + "\n" + "Employee Not Selected";
        cmbEmployee.style.border = invalid;
    } else addvalue = 1;


    if (quotation.quotationHasMaterialList.length == 0){
        errors = errors + "\n" + "Material Not Selected";
        cmbmaterial.style.border = invalid;
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
        title: "Are you sure to add following Quotation...?",
        text: "\nQuotation Number : " + quotation.qno +
            "\nQuotation Request Number : " + quotation.quotationrequest_id.qrno +
            "\nSupplier : " + quotation.supplier_id.companyname +
            "\nReceived date : " + quotation.reciveddate +
            "\nValid To : " + quotation.validto +
            "\nValid From : " + quotation.validfrom +
            "\nAdded date : " + quotation.addeddate  +
            "\nQuotation Status : " + quotation.quotationstatus_id.name +
            "\nEmployee : " + quotation.employee_id.callingname,


        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/quotation", "POST", quotation);
            console.log(response)
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
                //changeTab('table');
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

    if (oldquotation == null && addvalue == "") {
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

function fillForm(quo, rowno) {
    activerowno = rowno;

    if (oldquotation == null) {
        filldata(quo);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(quo);
            }

        });
    }

}


function filldata(quo) {
    clearSelection(tblQuotation);
    selectRow(tblQuotation, activerowno, active);

    quotation = JSON.parse(JSON.stringify(quo));
    oldquotation = JSON.parse(JSON.stringify(quo));


    txtqn.value = quotation.qno;
    dtreceiveddate.value = quotation.reciveddate;
    dtvalidto.value = quotation.validto;
    dtvalidfrom.value = quotation.validfrom;
    txtdescription.value = quotation.description;
    dtaaddeddate.value = quotation.addeddate;

    fillCombo(cmbstatus, "Select Status", quotationstatus, "name", quotation.quotationstatus_id.name);
    cmbstatus.disabled = false;

    fillCombo(cmbSupplier, "Select Status", suppliers, "companyname", quotation.supplier_id.companyname);
    cmbSupplier.disabled= true;

    fillCombo(cmbqrequest, "Select Quotation Request", quotationrequests, "qrno", quotation.quotationrequest_id.qrno);
    cmbqrequest.disabled= true;

    fillCombo(cmbemployee, "", employees, "callingname", quotation.employee_id.callingname);

    materialByQuotationRequest = httpRequest("/material/listByMaterial?quotationrequestid=" + JSON.parse(cmbqrequest.value).id, "GET");
    fillCombo(cmbmaterial, "Select Material", materialByQuotationRequest, "materialname", "");

    disableButtons(true, false, false);
    setStyle(valid);

   if (quotation.quotationstatus_id.name == "In-Valid"){
       dtreceiveddate.disabled =true;
   }else {
       dtreceiveddate.disabled =false;
   }

      //check null statements
    if (quotation.txtdescription == null){
        txtdescription.style.border = initial;
    }

    refreshInnerForm();
    //changeTab('form');
    $('#formmodel').modal('show')

}

function getUpdates() {

    var updates = "";

    if (quotation != null && oldquotation != null) {

        if (quotation.qno != oldquotation.qno)
            updates = updates + "\nQuotation Number is Changed.." + oldquotation.qno + " into " + quotation.qno;

        if (quotation.reciveddate != oldquotation.reciveddate)
            updates = updates + "\nReceived Date is Change.." + oldquotation.reciveddate + " into " + quotation.reciveddate;

        if (quotation.supplier_id.companyname != oldquotation.supplier_id.companyname)
            updates = updates + "\nSupplier is Change.." + oldquotation.supplier_id.companyname + " into " + quotation.supplier_id.companyname;

        if (quotation.validto != oldquotation.validto)
            updates = updates + "\nValid To Date is Change.." + oldquotation.validto + " into " + quotation.validto;

        if (quotation.validfrom != oldquotation.validfrom)
            updates = updates + "\nValid From Date is Changed.." + oldquotation.validfrom + " into " + quotation.validfrom;

        if (quotation.description != oldquotation.description)
            updates = updates + "\nDescription is Changed.." + oldquotation.description + " into " + quotation.description;

        if (quotation.addeddate != oldquotation.addeddate)
            updates = updates + "\nAdded Date is Changed.." + oldquotation.addeddate + " into " + quotation.addeddate;

        if (quotation.quotationrequest_id.qrno != oldquotation.quotationrequest_id.qrno)
            updates = updates + "\nQuotation Request is Changed.." + oldquotation.quotationrequest_id.qrno + " into " + quotation.quotationrequest_id.qrno;

        if (quotation.quotationstatus_id.name != oldquotation.quotationstatus_id.name)
            updates = updates + "\nQuotation Status is Changed.." + oldquotation.quotationstatus_id.name + " into " + quotation.quotationstatus_id.name;

        if (quotation.employee_id.callingname != oldquotation.employee_id.callingname)
            updates = updates + "\nCalling Name is Changed.." + oldquotation.employee_id.callingname + " into " + quotation.employee_id.callingname;


        if (isEqual(quotation.quotationHasMaterialList, oldquotation.quotationHasMaterialList , 'material_id'))
            updates = updates + "\nMaterial is Changed..";

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
                title: "Are you sure to update following Quotation details...?",
                text: "\n"+ getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/quotation", "PUT", quotation);
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

function btnDeleteMC(quo) {
    quotation = JSON.parse(JSON.stringify(quo)); // set as a json string and convert into js object
    quotationhasmaterial = JSON.parse(JSON.stringify(quo)); // set as a json string and convert into js object

    swal({
        title: "Are you sure to delete following Quotation...?",
        text: "\n Quotation Number : " + quotation.qno +
            "\n Company Name  : " +quotation.supplier_id.companyname +
            "\n Request Number  : " +quotation.quotationrequest_id.qrno,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/quotation", "DELETE", quotation);
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
        "<body><div style='margin-top: 50px; '> <h1>Supplier Details : </h1></div>" +
        "<div>" + formattab + "</div>" +
        "</body>" +
        "</html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
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