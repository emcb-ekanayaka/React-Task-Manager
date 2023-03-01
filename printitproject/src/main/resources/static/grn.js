
window.addEventListener("load", initialize);

//Initializing Functions

function initialize() {
    $('[data-toggle="tooltip"]').tooltip()

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);

    $('.js-example-basic-single').select2();
    cmbSupplier.addEventListener("change", cmbSupplierCH);
    //cmbPurchaseorder.addEventListener("change", cmbPurchaseorderCH);
    //cmbMaterial.addEventListener("change", cmbmaterialCH);
    txtqty.addEventListener("keyup", calculatech);
    txtDiscountratio.addEventListener("keyup", txtDiscountratiocal);
    txtSupplierbillno.addEventListener("keyup", txtSupplierbillnoCH);

    txtSearchName.addEventListener("keyup", btnSearchMC);

    privilages = httpRequest("../privilage?module=GRN", "GET");

    //data list for form combo
    grnSupplier = httpRequest("../supplier/list", "GET");
    porders  = httpRequest("../porder/list", "GET");
    grnStatus  = httpRequest("../grnstatus/list", "GET");
    grnEmployee  = httpRequest("../employee/list", "GET");

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
    grns = new Array();
    var data = httpRequest("/grn/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) grns = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblGrn', grns, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblGrn);

    if (activerowno != "") selectRow(tblGrn, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldgrn == null) {
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
        activerowno = "";
        loadForm();
        loadSearchedTable();
    }

}

function viewitem(gr, rowno) {

    grnview = JSON.parse(JSON.stringify(gr));

    tblGrnNumber.innerHTML =  grnview.grncode;
    tblSupplierName.innerHTML =  grnview.supplier_id.companyname;
    tblPurchaseOrder.innerHTML =  grnview.porder_id.pordercode;
    tblSupllierBill.innerHTML =  grnview.supplierbillno ;
    tblReceivedDate.innerHTML = grnview.recieveddate;
    tblGrandTotal.innerHTML = parseFloat(grnview.grandtotal).toFixed(2);
    tblDiscountRatio.innerHTML = grnview.discountratio;
    tblNetTotal.innerHTML = parseFloat(grnview.nettotal).toFixed(2);
    tblDescription.innerHTML = grnview.description;

    tblAddedDate.innerHTML = grnview.addeddate;
    tblStatus.innerHTML = grnview.grnstatus_id.name;
    TblEmployee.innerHTML = grnview.employee_id.callingname;

    fillInnerTable("tblPrintInnerMaterial", grnview.grnHasMaterialList, fillInnerForm, btnInnerDeleteMC, viewInnerMaterial)
    $('#grnmodal').modal('show')

}

function btnPrintrow() {

    var format = printformtable.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'></head>" +
        "<body><div style='margin-top: 150px'><h1>GRN Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);

}

function loadForm() {
    grn = new Object();
    oldgrn = null;

    //create array List

    grn.grnHasMaterialList = new Array();

    fillCombo(cmbSupplier, "Select Supplier", grnSupplier, "companyname", "");
    fillCombo(cmbPurchaseorder, "Select Purchase Order", porders, "pordercode", "");
    fillCombo(cmbStatus, "Select Grn Status", grnStatus, "name", "Pending");
    fillCombo(cmbEmployee, "", grnEmployee, "callingname", session.getObject('activeuser').employeeId.callingname);

    grn.grnstatus_id = JSON.parse(cmbStatus.value);
    grn.employee_id = JSON.parse(cmbEmployee.value);
    cmbEmployee.disabled = true;
    cmbStatus.disabled = true;


    cmbAddedDate.value= getCurrentDateTime("date");
    grn.addeddate = cmbAddedDate.value;
    cmbAddedDate.disabled = true;
    cmbAddedDate.style.border = valid;

    // Get Next Number Form Data Base
    var nextNumber = httpRequest("/grn/nextnumber", "GET");
    txtGrncode.value = nextNumber.grncode;
    grn.grncode = txtGrncode.value;
    txtGrncode.disabled = "disabled";
    txtGrncode.style.border = valid;

    txtReceiveddate.max = getCurrentDateTime("date");
    let today = new Date();
    let afteroneweek = new Date();
    afteroneweek.setDate(today.getDate()-7);
    let month = afteroneweek.getMonth()+1;
    if (month < 10) month = "0" +month; // [0-10]
    let day = afteroneweek.getDate(); // range (1-31)
    if (day < 10) day = "0"+day;
    txtReceiveddate.min = afteroneweek.getFullYear()+"-"+month+"-"+day;

    cmbSupplier.value = "";
    cmbPurchaseorder.value = "";

    txtSupplierbillno.value = "";
    txtReceiveddate.value = "";
    txtGrandtotal.value = "";

    txtDiscountratio.value = "";
    txtNettotal.value = "";

    txtDescription.value = "";

    txtDiscountratio.value = 0;
    txtNettotal.disabled = true;
    txtGrandtotal.disabled = true;
    txtDiscountratio.disabled = true;
    cmbPurchaseorder.disabled = true;
    btnInnerAdd.disabled=true;
    btnInnerupdate.disabled = true;
    cmbSupplier.disabled=false;

    setStyle(initial);


    disableButtons(false, true, true);
    refreshInnerForm();
}

function cmbmaterialCH(){
    var data = httpRequest("/porderhasmaterial/byporderhasmaterial?porderid=" + JSON.parse(cmbPurchaseorder.value).id + "&materialid=" + JSON.parse(cmbMaterial.value).id , "GET");
    txtPurchaseprice.value  = parseFloat(JSON.parse(data.purchaseprice)).toFixed(2);
    txtPurchaseprice.style.border = valid;
    txtqty.value  = JSON.parse(data.qty);
    txtqty.style.border = valid;
    grnhasmaterial.purchaseprice = txtPurchaseprice.value;
    txtPurchaseprice.disabled = true;
    txtqty.disabled = false;
    btnInnerAdd.disabled=false;

}
function txtDiscountratiocal(){
    // if discount ratio = empty ---> grand total get empty box
    if (txtDiscountratio.value ==""){
        txtNettotal.value = "";
        grn.nettotal= null;
        txtNettotal.style.border = initial;
    }else {
        var discountvalue =  (txtGrandtotal.value * txtDiscountratio.value) / 100;
        discountvalue = txtGrandtotal.value - discountvalue;
        txtNettotal.value =  parseFloat(discountvalue).toFixed(2);
        grn.nettotal = txtNettotal.value;
    }

    if (oldgrn !=null && grn.nettotal != oldgrn.nettotal){
        txtNettotal.style.border = updated;
    }else if(txtDiscountratio.value !=""){
        txtNettotal.style.border = valid;
    }
}

function calculatech(){
    if (txtqty.value!=0 ){
        txtLineTotal.value = (parseFloat(txtPurchaseprice.value) * parseFloat(txtqty.value)).toFixed(2);
        txtLineTotal.style.border = valid;
        if (grnhasmaterial!=null && oldgrnhasmaterial != null){
            if (grnhasmaterial.qty != oldgrnhasmaterial.qty){
                txtLineTotal.style.border = updated;
                btnInnerAdd.disabled=true;
            }else {
                txtLineTotal.style.border = valid;
            }
        }
        grnhasmaterial.linetotal =  txtLineTotal.value;

    }else {

        swal({
            title: 'Can\'t Enter Empty Field..!', icon: "warning",
            text: '\n',
            button: false,
            timer: 1200
        });
        txtqty.value = "";
        txtqty.style.border = initial;
        grnhasmaterial.qty= null;
        txtLineTotal.value = "";
        txtLineTotal.style.border = initial;
        grnhasmaterial.linetotal= null;
    }
}

function cmbPurchaseorderCH(){
    materiallistbyporder = httpRequest("/material/listByMaterial?porderid=" + JSON.parse(cmbPurchaseorder.value).id, "GET");
    fillCombo(cmbMaterial, "Select Material", materiallistbyporder, "materialname", "");
    grn.grnHasMaterialList = new Array();
    refreshInnerForm();
    $("#materialselect2parent .select2-container").css('border',initial);
}

function cmbSupplierCH(){

    $("#porderselect2parent .select2-container").css('border',initial);
    cmbPurchaseorder.value = "";
    cmbPurchaseorder.disabled = false;
    grn.cmbPurchaseorder = null;

    porderlistbysupplier = httpRequest("/porder/listbyporder?supplierid=" + JSON.parse(cmbSupplier.value).id, "GET");
    fillCombo(cmbPurchaseorder, "Select Purchase Order", porderlistbysupplier, "pordercode", "");
    grn.grnHasMaterialList = new Array();
    btnInnerAdd.disabled=true;
    refreshInnerForm();

}

function txtSupplierbillnoCH(){
    console.log("1")

    for (var dubcatebill in grns) {
        console.log("2")
        var existingbillno = grns[dubcatebill].supplierbillno;

        if (txtSupplierbillno.value == existingbillno){

            swal({
                title: 'Already Existed Bill Number..!', icon: "warning",
                text: '\n',
                button: false,
                timer: 1200
            });
            txtSupplierbillno.value = "";
            txtSupplierbillno.style.border = initial;
            grn.supplierbillno= null;
        }

        console.log("4")
    }

}


function refreshInnerForm() {

    grnhasmaterial = new Object();
    oldgrnhasmaterial = null;
    grandamount=0;

    if (grn.grnHasMaterialList.length!=0){
        for (var index in grn.grnHasMaterialList){
            grandamount = (parseFloat(grandamount) + parseFloat(grn.grnHasMaterialList[index].linetotal)).toFixed(2);
        }
        grn.grandtotal  = grandamount;
        txtGrandtotal.value = grn.grandtotal;

        if (oldgrn != null && grn.grandtotal != oldgrn.grandtotal){
            txtGrandtotal.style.border = updated;
        }else {
            txtGrandtotal.style.border = valid;
        }
    }else {
        txtGrandtotal.value = "";
        grn.grandtotal = null;
        txtGrandtotal.style.border = initial;
    }

    if(cmbPurchaseorder.value !=""){
        cmbMaterial.disabled = false;
        txtPurchaseprice.disabled = true;
        txtqty.disabled = false;
        txtLineTotal.disabled = true;
    }else {
        cmbMaterial.disabled = true;
        txtPurchaseprice.disabled = true;
        txtqty.disabled = true;
        txtLineTotal.disabled = true;
    }
    $("#materialselect2parent .select2-container").css('border',initial);
    txtPurchaseprice.style.border = initial;
    txtqty.style.border = initial;
    txtLineTotal.style.border = initial;

    cmbMaterial.value="";
    txtPurchaseprice.value="";
    txtqty.value="";
    txtLineTotal.value="";
    txtqty.disabled = true;

    // to enable the discount ratio value
    if (grn.grandtotal != null){
        txtDiscountratio.disabled = false;
    }else {
        txtDiscountratio.disabled = true;
    }

    fillInnerTable("tblInnerMaterial", grn.grnHasMaterialList, fillInnerForm, btnInnerDeleteMC, viewInnerMaterial)

}

function checkinnerempty(){
    var error = "";

    if (grnhasmaterial.material_id == null){
        error = error + "\n" + "Select A Material...!";
        cmbMaterial.style.border = invalid;
    }

    if (grnhasmaterial.qty == null){
        error = error + "\n" + "Enter Qty...!";
        txtqty.style.border = invalid;
    }
    return error;

}

function btnInnerAddMc() {

    if (checkinnerempty()==""){

        var matext = false;
        for (var index in  grn.grnHasMaterialList) {
            if ( grn.grnHasMaterialList[index].material_id.materialname == grnhasmaterial.material_id.materialname) {
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

            grn.grnHasMaterialList.push(grnhasmaterial);
            refreshInnerForm();

        }
    }else {
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

    if(grnhasmaterial !=null && oldgrnhasmaterial!=null) {
        if (grnhasmaterial.qty != oldgrnhasmaterial.qty)
            innerupdates = innerupdates + "\nQuantity Changed.." + oldgrnhasmaterial.qty + " into " + grnhasmaterial.qty;

    }
    return innerupdates;
}

function fillInnerForm(obgr, innrrowno) {
    innerrow = innrrowno
    grnhasmaterial = JSON.parse(JSON.stringify(obgr));
    oldgrnhasmaterial = JSON.parse(JSON.stringify(obgr));
    btnInnerupdate.disabled = false;
    btnInnerAdd.disabled = true;

    fillCombo(cmbMaterial, "Select Material", materiallistbyporder, "materialname", grnhasmaterial.material_id.materialname);
    cmbMaterial.disabled = true;
    cmbMaterial.style.border = valid;
    txtPurchaseprice.value = parseFloat(grnhasmaterial.purchaseprice).toFixed(2);
    txtPurchaseprice.style.border = valid;
    txtqty.value = grnhasmaterial.qty;
    txtqty.disabled=false;
    txtqty.style.border = valid;
    txtLineTotal.value = parseFloat(grnhasmaterial.linetotal).toFixed(2);
    txtLineTotal.style.border = valid;
}

function btnInnerupdateMc() {

    var innerupdate = getInnerUpdates();

    if (innerupdate == ""){
        swal({
            className:"innermasserposition",
            text: '\n Nothing Updated..!',
            button: false,
            timer: 1200
        });
    }else {
        grn.grnHasMaterialList[innerrow] = grnhasmaterial;
        refreshInnerForm();
        btnInnerupdate.disabled = true;

        txtDiscountratio.value = 0;
        txtNettotal.value = "";

        txtDiscountratio.style.border = initial;
        txtNettotal.style.border = initial;

        grn.discountratio = null;
        grn.nettotal = null;
    }
}


function btnInnerclearMc(){

    swal("Clear Inner Form?", {
        className:"innermasserposition",
        dangerMode: true,
        buttons: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            cmbMaterial.value="";
            txtPurchaseprice.value="";
            txtqty.value="";
            txtLineTotal.value="";
            refreshInnerForm();
            btnInnerupdate.disabled=true;
        }
    });

}

function btnInnerDeleteMC(innerob, innerrow) {

    swal({
        title: "Are you sure to Delete following material...?",

        text: "\nMaterial Name :" + innerob.material_id.materialname,
        icon: "warning", buttons: true, dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                grn.grnHasMaterialList.splice(innerrow, 1)

                txtDiscountratio.value = 0;
                txtNettotal.value = "";

                txtDiscountratio.style.border = initial;
                txtNettotal.style.border = initial;

                grn.discountratio = null;
                grn.nettotal = null;
                refreshInnerForm();
            }
        });

}

function viewInnerMaterial() {
}

function setStyle(style) {


    $("#porderselect2parent .select2-container").css('border',style);
    cmbSupplier.style.border = style;

    txtSupplierbillno.style.border = style;
    txtReceiveddate.style.border = style;
    txtGrandtotal.style.border = style;

    txtDiscountratio.style.border = style;
    txtNettotal.style.border = style;

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
    for(inde in grns) {

        tblGrn.children[1].children[inde].lastChild.children[0].style.display = "none";
        tblGrn.children[1].children[inde].lastChild.children[1].style.display = "none";

     /*   if(grns[index].grnstatus_id.name == "Deleted") {
            tblGrn.children[1].children[index].style.color = "#f00";
            tblGrn.children[1].children[index].style.border = "2px solid red";

        }*/

    }
}


function getErrors() {

    var errors = "";
    addvalue = "";

    if (grn.grncode == null) {
        errors = errors + "\n" + "gr-Code Not Enter";
        txtGrncode.style.border = invalid;
    } else addvalue = 1;

    if (grn.supplier_id == null) {
        errors = errors + "\n" + "Supplier Not Selected";
        cmbSupplier.style.border = invalid;
    } else addvalue = 1;

    if (grn.porder_id == null) {
        errors = errors + "\n" + "Purchase Order Code Not Selected";
        cmbPurchaseorder.style.border = invalid;
    } else addvalue = 1;

    if (grn.supplierbillno  == null) {
        errors = errors + "\n" + "Supplier Bill Not Enter";
        txtSupplierbillno.style.border = invalid;
    } else addvalue = 1;

    if (grn.recieveddate == null) {
        errors = errors + "\n" + "Received Date Not Selected";
        txtReceiveddate.style.border = invalid;
    } else addvalue = 1;

    if (grn.grandtotal  == null) {
        errors = errors + "\n" + "Grand Total Not Enter";
        txtGrandtotal.style.border = invalid;
    } else addvalue = 1;


    if (grn.discountratio == null) {
        errors = errors + "\n" + "Discount Ratio Not Enter";
        txtDiscountratio.style.border = invalid;
    } else addvalue = 1;

    if (grn.nettotal == null) {
        errors = errors + "\n" + "Net Total Not Enter";
        txtNettotal.style.border = invalid;
    } else addvalue = 1;

    if (grn.addeddate == null) {
        errors = errors + "\n" + "Added Date-Not Selected ";
        cmbAddedDate.style.border = invalid;
    } else addvalue = 1;

    if (grn.grnstatus_id == null) {
        errors = errors + "\n" + "Status Not Selected";
        cmbStatus.style.border = invalid;
    } else addvalue = 1;

    if (grn.employee_id == null) {
        errors = errors + "\n" + "Employee Not Selected";
        cmbEmployee.style.border = invalid;
    } else addvalue = 1;

    if (grn.grnHasMaterialList.length == 0) {
        errors = errors + "\n" + "Material Not Selected";
        cmbMaterial.style.border = invalid;
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
        title: "Are you sure to add following GRN...?",
        text: "\nGrn Code : " + grn.grncode +
            "\nSupplier Name : " + grn.supplier_id.companyname +
            "\nPurchase Order : " + grn.porder_id.pordercode +
            "\nSupplier Bill Number : " + grn.supplierbillno +
            "\nReceived Date : " + grn.recieveddate +
            "\nGrand Total : " + grn.grandtotal +
            "\nDiscount Ratio : " + grn.discountratio +
            "\nNet Total: " + grn.nettotal +
            "\nAdded Date : " + grn.addeddate +
            "\nStatus : " + grn.grnstatus_id.name +
            "\nEmployee Name : " + grn.employee_id.callingname,


        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/grn", "POST", grn);
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

    if (oldgrn == null && addvalue == "") {
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

function fillForm(grnote, rowno) {
    activerowno = rowno;

    if (oldgrn == null) {
        filldata(grnote);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(grnote);
            }

        });
    }

}


function filldata(grnote) {
    clearSelection(tblGrn);
    selectRow(tblGrn, activerowno, active);

    grn = JSON.parse(JSON.stringify(grnote));
    oldgrn = JSON.parse(JSON.stringify(grnote));

    txtGrncode.value = grn.grncode;
    txtSupplierbillno.value = grn.supplierbillno;
    txtReceiveddate.value = grn.recieveddate;
    txtGrandtotal.value = parseFloat(grn.grandtotal).toFixed(2);
    txtDiscountratio.value = parseFloat(grn.discountratio).toFixed(2);
    txtNettotal.value = parseFloat(grn.nettotal).toFixed(2);
    txtDescription.value = grn.description;
    cmbAddedDate.value = grn.addeddate;

    fillCombo(cmbStatus, "Select Status", grnStatus, "name", grn.grnstatus_id.name);
    cmbStatus.disabled = false;

    fillCombo(cmbSupplier, "Select Supplier", grnSupplier, "companyname", grn.supplier_id.companyname);
    cmbSupplier.disabled = true;

    fillCombo(cmbEmployee, "Select Employeee", grnEmployee, "callingname", grn.employee_id.callingname);

    fillCombo(cmbPurchaseorder, "", porders, "pordercode", grn.porder_id.pordercode);
    cmbPurchaseorder.disabled = true;

    materiallistbyporder = httpRequest("/material/listByMaterial?porderid=" + JSON.parse(cmbPurchaseorder.value).id, "GET");
    fillCombo(cmbMaterial, "Select Material", materiallistbyporder, "materialname", "");

    disableButtons(true, false, false);
    setStyle(valid);

    if (grn.description == null){
        txtDescription.style.border = initial;
    }

    refreshInnerForm();
    $('#formmodel').modal('show')


}

function getUpdates() {

    var updates = "";

    if (grn != null && oldgrn != null) {

        if (grn.grncode != oldgrn.grncode)
            updates = updates + "\nGrn Code is Changed.." + oldgrn.grncode + " into " + grn.grncode;

        if (grn.supplier_id.companyname != oldgrn.supplier_id.companyname)
            updates = updates + "\nSupplier Name is Changed.." + oldgrn.supplier_id.companyname + " into " + grn.supplier_id.companyname;

        if (grn.porder_id.pordercode != oldgrn.porder_id.pordercode)
            updates = updates + "\nPurchase Order Code is Changed.." + oldgrn.porder_id.pordercode + " into " + grn.porder_id.pordercode;

        if (grn.supplierbillno != oldgrn.supplierbillno)
            updates = updates + "\nSupplier Bill No is Changed.." + oldgrn.supplierbillno + " into " + grn.supplierbillno;

        if (grn.recieveddate != oldgrn.recieveddate)
            updates = updates + "\nReceived Date is Changed.." + oldgrn.recieveddate + " into " + grn.recieveddate;

        if (grn.grandtotal != oldgrn.grandtotal)
            updates = updates + "\nGrand Total is Changed.." + oldgrn.grandtotal + " into " + grn.grandtotal;

        if (grn.discountratio != oldgrn.discountratio)
            updates = updates + "\nDiscount Ratio is Changed.." + oldgrn.discountratio + " into " + grn.discountratio;

        if (grn.nettotal != oldgrn.nettotal)
            updates = updates + "\nNet-Total is Changed.." + oldgrn.nettotal + " into " + grn.nettotal;

        if (grn.addeddate != oldgrn.addeddate)
            updates = updates + "\nAdded Date is Changed.." + oldgrn.addeddate + " into " + grn.addeddate;

        if (grn.grnstatus_id.name != oldgrn.grnstatus_id.name)
            updates = updates + "\nGrn Status is Changed.." + oldgrn.grnstatus_id.name + " into " + grn.grnstatus_id.name;

        if (grn.employee_id.callingname != oldgrn.employee_id.callingname)
            updates = updates + "\nEmployee is Changed.." + oldgrn.employee_id.callingname + " into " + grn.employee_id.callingname;

        if (isEqualtolist(grn.grnHasMaterialList, oldgrn.grnHasMaterialList , 'material_id'))
            updates = updates + "\nMaterial is Changed..";

        if (isEqualtolist(grn.grnHasMaterialList, oldgrn.grnHasMaterialList , 'linetotal'))
            updates = updates + "\nMaterial Qty is Changed.."

    }
    return updates;
}


function btnDeleteMC(grdel) {
    grn = JSON.parse(JSON.stringify(grdel));

    swal({
        title: "Are you sure to delete following GRN...?",
        text: "\n GRN Code Number : " + grn.grncode +
            "\n Supplier Name  : " + grn.supplier_id.companyname,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/grn", "DELETE", grn);
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
    disableButtons();
}

function btnSearchClearMC() {
    loadView();
}

function btnPrintTableMC(sup) {

    //open a new window for print table
    var newwindow = window.open();
    //get the table view for a variable
    formattab = tblGrn.outerHTML;

    //write the table for the new open tab
    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 50px; '> <h1>GRN Details : </h1></div>" +
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
            className: "swal-button",
            title: "Do you want to close the model...?",
            icon: "warning", buttons: true, dangerMode: true,

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