window.addEventListener("load", initialize);

//Initializing Functions

function initialize() {
    $('[data-toggle="tooltip"]').tooltip()

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    $('.js-example-basic-single').select2();

   txtSearchName.addEventListener("keyup", btnSearchMC);
   //cmbproducttype.addEventListener("change",  cmbproducttypeCH);
    //cmbdesigncode.addEventListener("change", cmbdesigncodeCH);

    privilages = httpRequest("../privilage?module=PRODUCT", "GET");

    //data list for form combo
    designTypes = httpRequest("../designtype/list", "GET");
    producttype = httpRequest("../producttype/list", "GET");
    designcodes = httpRequest("../productdesigntype/list", "GET");
    employees = httpRequest("../employee/list", "GET");
    productstatus = httpRequest("../productstatus/list", "GET");

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
    $('#collapseOne').collapse("hide")
}

function clearaddphoto(){
    filephoto.value ="";
    imgviewphoto.src = "";
    product.photo = null;
    product.imagename = null;
    imgviewphoto.style.display = "none";
    picname.value = "";
    picname.style.border = "initial";
    picname.disabled = true;

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
    products = new Array();
    var data = httpRequest("/product/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) products = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblProduct', products, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblProduct);

    if (activerowno != "") selectRow(tblProduct, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldproduct == null) {
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

function viewitem(pro, rowno) {

    productview = JSON.parse(JSON.stringify(pro));

    tblproductcode.innerHTML =  productview.productcode;
    tblproducttype.innerHTML =  productview.producttype_id.name;
    tbldesignCode.innerHTML =  productview.designtype_id.designcode;
    tblproductname.innerHTML =  productview.productname;
    tblproductioncost.innerHTML = parseFloat(productview.productioncost).toFixed(2);
    tblprofit.innerHTML = productview.profitratio;
    tbladdeddate.innerHTML = productview.addeddate;
    tblproductstatus.innerHTML = productview.productstatus_id.name;
    tblemployee.innerHTML = productview.employee_id.callingname;

    if (productview.description != null){
        tbldescription.innerHTML = productview.description;
    }
 /*   if(productview.photo==null)
        tblproductimage.src= 'resourse/image/noimage.png';
    else
        tblproductimage.src = atob(productview.photo);*/

    if(productview.designedphoto==null)
        tbldesignedpic.src= 'resources/image/noimage.png';
    else
        tbldesignedpic.src = atob(productview.designedphoto);

    if(productview.designtype_id.photo==null)
        tbldesignimage.src= 'resourse/image/noimage.png';
    else
        tbldesignimage.src = atob(productview.designtype_id.photo);

    if(productview.producttype_id.producttypephoto==null)
        tblproductimage.src= 'resourse/image/noimage.png';
    else
        tblproductimage.src = atob(productview.producttype_id.producttypephoto);


    fillInnerTable("tblPrintInnerMaterial", productview.productHasMaterialList, fillInnerForm, btnInnerDeleteMC, viewInnerMaterial)
    $('#viewmodal').modal('show')

}

function btnPrintrow() {

    var format = printformtable.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'></head>" +
        "<body><div style='margin-top: 150px'><h1>Product Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);

}

function cmbdesigntyeCH(){

    changeptypebydesigntype = httpRequest("/producttype/listbydesigntype?designtype=" + JSON.parse(cmbdesigntye.value).id, "GET");
    fillCombo(cmbproducttype,"Select Product Type",changeptypebydesigntype,"name","");
    cmbproducttype.disabled = false;
    $("#producttypeselect2parent .select2-container").css('border',initial);
    product.producttype_id = null;

    changedesigncodebydesigntype = httpRequest("/productdesigntype/listbydesigntype?listbydesigntype=" + JSON.parse(cmbdesigntye.value).id, "GET");
    fillCombo(cmbdesigncode,"Select Design Code",changedesigncodebydesigntype,"designcode","");

    if (oldproduct != null && oldproduct.designtype_id.dtype_id.name != JSON.parse(cmbdesigntye.value).name) {
        cmbdesigntye.style.border = updated;
    } else {
        cmbdesigntye.style.border = valid;
    }
    cmbproducttype.disabled = false;
    cmbdesigncode.disabled = true;

    txtproductioncost.value = "";
    txtprofit.value = "";
    txtproductname.value = "";

    txtproductioncost.style.border = initial;
    txtprofit.style.border = initial;
    txtproductname.style.border = initial;

    product.productioncost = null;
    product.profitratio = null;
    product.productname = null;
    $("#designcodeselect2parent .select2-container").css('border',initial);

    $('#collapseOne').collapse("hide")
}

function cmbproducttypeCH(){
        cmbdesigncode.disabled = false;
        var desgnimage = JSON.parse(cmbproducttype.value).producttypephoto;

        if(desgnimage==null && oldproduct == null){
        imgproduct.src= 'resources/image/noimage.png';
        txtprofit.value= "";
        txtprofit.style.border = initial;
        product.profitratio = null;

        txtproductioncost.value = "";
        txtproductioncost.style.border = initial;
        product.productioncost =  null;

        fillCombo(cmbdesigncode,"Select Design Code",changedesigncodebydesigntype,"designcode","");
        $("#designcodeselect2parent .select2-container").css('border',initial);

        }else if(desgnimage==null && oldproduct != null){
        imgproduct.src= 'resources/image/noimage.png';
        txtprofit.value= "";
        txtprofit.style.border = initial;
        product.profitratio = null;

        txtproductioncost.value = "";
        txtproductioncost.style.border = initial;
        product.productioncost =  null;

        cmbdesigncode.value ="";
        $("#designcodeselect2parent .select2-container").css('border',initial);

        }else{
        imgproduct.src = atob(desgnimage); // encrypt to decrypt
        txtprofit.value = JSON.parse(cmbproducttype.value).profitratio;
        txtprofit.style.border = valid;
        product.profitratio = txtprofit.value;
    }

}

function cmbdesigncodeCH(){
    $('#collapseOne').collapse("show")
    $("#designcodeselect2parent .select2-container").css('border',valid);

    var desgnimage = JSON.parse(cmbdesigncode.value).photo;
    imgproductdesign.src = atob(desgnimage); // encrypt to decrypt

    txtdesigncategory.innerHTML = JSON.parse(cmbdesigncode.value).dcategory_id.name;
    txtdesigntype.innerHTML = JSON.parse(cmbdesigncode.value).dtype_id.name;
    txproducttype.innerHTML = JSON.parse(cmbdesigncode.value).producttype_id.name;
    txtdesignname.innerHTML = JSON.parse(cmbdesigncode.value).designname;
    txtbilltype.innerHTML = JSON.parse(cmbdesigncode.value).customtype_id.name;

    if (JSON.parse(cmbdesigncode.value).designer_id != null){
        txtdesigner.innerHTML = JSON.parse(cmbdesigncode.value).designer_id.callingname;
    }else{
        txtdesigner.innerHTML = "-";
    }

    txtproductname.value = JSON.parse(cmbdesigncode.value).designname;
    product.productname = txtproductname.value;
    txtproductname.style.border = valid;

    if (oldproduct ==null){
        txtproductioncost.value = JSON.parse(cmbdesigncode.value).designcost;
        txtproductioncost.style.border = valid;
        product.productioncost =  txtproductioncost.value;
    }

}

function cmbmaterialCH(){
    btnInnerAdd.disabled = false;
}

function loadForm() {
    product = new Object();
    oldproduct = null;

    //create array List
    product.productHasMaterialList = new Array();

    fillCombo(cmbdesigncode, "Select Design Code", designcodes, "designcode", "");
    fillCombo(cmbproducttype, "Select Product Type", producttype, "name", "");
    fillCombo(cmbdesigntye, "Select Design Type", designTypes, "name", "");

    fillCombo(cmbproductstatus, "Select Product Status", productstatus, "name", "Add-Completed");
    product.productstatus_id = JSON.parse(cmbproductstatus.value);
    cmbproductstatus.disabled = true;

    fillCombo(cmbEmployee, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    product.employee_id = JSON.parse(cmbEmployee.value);
    cmbEmployee.disabled = true;


    cmbaddeddate.value= getCurrentDateTime("date");
    product.addeddate = cmbaddeddate.value;
    cmbaddeddate.disabled = true;
    cmbaddeddate.style.border = valid;

    // Get Next Number Form Data Base
    var nextNumber = httpRequest("/product/nextnumber", "GET");
    console.log(nextNumber)
    txtproductcode.value = nextNumber.productcode;
    product.productcode = txtproductcode.value;
    txtproductcode.disabled = "disabled";
    txtproductcode.style.border = valid;

    /*removeFile('flePhoto');*/
    filephoto.value ="";
    imgviewphoto.src = "";
    imgviewphoto.style.display = "none";
    picname.disabled = true;
    picname.value ="";
    picname.style.border =initial;

    cmbproducttype.value = "";
    cmbdesigntye.value = "";
    txtproductname.value = "";
    txtproductioncost.value = "";
    txtprofit.value = "";
    txtDescription.value = "";

    setStyle(initial);
    cmbproductstatus.style.border = valid;
    cmbEmployee.style.border = valid;
    cmbaddeddate.style.border = valid;

    cmbproducttype.disabled = true;
    cmbdesigncode.disabled = true;
    txtproductname.disabled = true;
    disableButtons(false, true, true);
    refreshInnerForm();
    $('#collapseOne').collapse("hide")
}

function refreshInnerForm() {

    productHasMaterial = new Object();
    oldproductHasMaterial = null;

    fillInnerTable("tblInnerMaterial", product.productHasMaterialList, fillInnerForm, btnInnerDeleteMC, true);
    fillCombo(cmbMaterial, "Select Material", materials, "materialname", "");
    $("#productmaterialselect2parent .select2-container").css('border',initial);

    cmbMaterial.style.border = initial;
    txtQuantity.style.border = initial;

    txtQuantity.value ="";
    btnInnerupdate.disabled = true;

    /*if (supplier.supplierHasMaterials.length != 0) {
        for (var index in supplier.supplierHasMaterials)
            tblInnerMaterial.children[1].children[index].lastChild.children[0].style.display = "none";
    }*/
}

function innerempty(){
    var errors = "";
    addvalue = "";

    if (productHasMaterial.material_id == null) {
        errors = errors + "\n" + "Material Not Selected";
        cmbMaterial.style.border = invalid;
    } else addvalue = 1;

    if (productHasMaterial.qty == null) {
        errors = errors + "\n" + "Quantity Not Enter";
        txtQuantity.style.border = invalid;
    } else addvalue = 1;

    return errors;
}

function btnInnerAddMc() {

    var matext = false;
    if (innerempty()==""){
        for (var index in product.productHasMaterialList) {
            if (product.productHasMaterialList[index].material_id.materialname == productHasMaterial.material_id.materialname) {
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
            product.productHasMaterialList.push(productHasMaterial);
            refreshInnerForm();
        }
    }else {
        swal({
            title: "You have following errors",
            text: "\n"+innerempty(),
            icon: "error",
            button: true,
        });
    }



}

function btnInnerClearMc(){

    swal("Clear Inner Form?", {
        className:"innermasserposition",
        dangerMode: true,
        buttons: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                refreshInnerForm();
            }
        });

}

function getInnerUpdates() {

    var innerupdates = "";

    if(productHasMaterial!=null && oldproductHasMaterial!=null) {
        if (productHasMaterial.qty != oldproductHasMaterial.qty)
            innerupdates = innerupdates + "\nQuantity Changed.." + oldproductHasMaterial.qty + " into " + productHasMaterial.qty;
    }

    if(productHasMaterial != null && oldproductHasMaterial != null) {
        if (productHasMaterial.material_id.materialname != oldproductHasMaterial.material_id.materialname)
            innerupdates = innerupdates + "\nMaterial Changed.." + oldproductHasMaterial.material_id.materialname + " into " + productHasMaterial.material_id.materialname;
    }
    console.log(innerupdates)
    return innerupdates;
}

function fillInnerForm(ob, innrrowno) {
    innerrow = innrrowno
    productHasMaterial = JSON.parse(JSON.stringify(ob));
    oldproductHasMaterial = JSON.parse(JSON.stringify(ob));
    btnInnerupdate.disabled = false;
    btnInnerAdd.disabled = true;

    fillCombo(cmbMaterial, "Select Material", materials, "materialname", productHasMaterial.material_id.materialname);
    txtQuantity.value = productHasMaterial.qty;
    txtQuantity.style.border = valid;
    $("#productmaterialselect2parent .select2-container").css('border',valid);
    btnInnerupdate.disabled = false;

}

function btnInnerupdateMc(){
    var innerupdate = getInnerUpdates();

    if (innerupdate == ""){
        console.log("AAA")
        swal({
            className:"innermasserposition",
            text: '\n Nothing Updated..!',
            button: false,
            timer: 1200
        });
    }else {
        if(checkinnerempty() == ""){
            product.productHasMaterialList[innerrow] = productHasMaterial;
            console.log(productHasMaterial)
            refreshInnerForm();
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

function checkinnerempty(){
    var error = "";

    if (productHasMaterial.material_id == null){
        error = error + "\n" + "Select A Material...!";
        cmbMaterial.style.border = invalid;
    }

    if(productHasMaterial.qty == null){
        error = error + "\n" + "Qty Not Entered...!";
        txtQuantity.style.border = invalid;
    }
    return error;
}

function btnInnerDeleteMC(innerob, innerrow) {

    swal({
        title: "Are you sure to Delete following material...?",

        text: "\nMaterial Name :" + innerob.material_id.materialname,
        icon: "warning", buttons: true, dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                product.productHasMaterialList.splice(innerrow, 1)
                refreshInnerForm();
            }
        });

}

function viewInnerMaterial() {
}

function setStyle(style) {

    $("#productdesigntypeselect2parent .select2-container").css('border',style);
    $("#producttypeselect2parent .select2-container").css('border',style);
    $("#designcodeselect2parent .select2-container").css('border',style);
    cmbdesigncode.style.border = style;
    txtproductname.style.border = style;
    txtproductioncost.style.border = style;
    txtprofit.style.border = style;
    txtDescription.style.border = style;
    cmbaddeddate.style.border = style;
    cmbproductstatus.style.border = style;
    cmbEmployee.style.border = style;

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
    for (index in products) {
        if (products[index].productstatus_id.name == "Deleted") {
            tblProduct.children[1].children[index].style.color = "#f00";
            tblProduct.children[1].children[index].style.border = "2px solid red";
            tblProduct.children[1].children[index].lastChild.children[1].disabled = true;
            tblProduct.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (product.productcode == null) {
        errors = errors + "\n" + "product Code Not Enter";
        txtproductcode.style.border = invalid;
    } else addvalue = 1;

    if (product.designtype_id == null) {
        errors = errors + "\n" + "Design type Not Selected";
        $("#productdesigntypeselect2parent .select2-container").css('border',invalid);
    } else addvalue = 1;

    if (product.producttype_id == null) {
        errors = errors + "\n" + "product Type Not Selected";
        $("#producttypeselect2parent .select2-container").css('border',invalid);
    } else addvalue = 1;

    if (product.productname == null) {
        errors = errors + "\n" + "Product Name Not Enter";
        txtproductname.style.border = invalid;
    } else addvalue = 1;

    if (product.productioncost == null) {
        errors = errors + "\n" + "Product Cost Not Confirm";
        txtproductioncost.style.border = invalid;
    } else addvalue = 1;

    if (product.profitratio == null) {
        errors = errors + "\n" + "Profit Ratio Not Enter";
        txtprofit.style.border = invalid;
    } else addvalue = 1;

    if (product.addeddate == null) {
        errors = errors + "\n" + "Added Date Not selected";
        cmbaddeddate.style.border = invalid;
    } else addvalue = 1;

    if (product.productstatus_id == null) {
        errors = errors + "\n" + "product Status Not Selected";
        cmbproductstatus.style.border = invalid;
    } else addvalue = 1;

    if (product.employee_id == null) {
        errors = errors + "\n" + "Employee Not Selected";
        cmbEmployee.style.border = invalid;
    } else addvalue = 1;

    if (product.productHasMaterialList.length == 0) {
        if (cmbMaterial.value == ""){
            cmbMaterial.style.border = invalid;
            errors = errors + "\n" + "Material Not Selected";
        }else {
            cmbMaterial.style.border = valid;
            errors = errors + "\n" + "Material Not Selected";
        }

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
        title: "Are you sure to add following Product...?",
        text: "\nProduct Code : " + product.productcode +
            "\nDesign Type : " + product.designtype_id.dtype_id.name +
            "\nProduct Type : " + product.producttype_id.name +
            "\nProduct Name : " + product.productname +
            "\nProduct Cost : " + product.productioncost +
            "\nProfit Ratio : " + product.profitratio +
            "\nAdded date : " + product.addeddate +
            "\nProduct Status: " + product.productstatus_id.name +
            "\nEmployee : " + product.employee_id.callingname,


        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/product", "POST", product);
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

    if (oldproduct == null && addvalue == "") {
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

function fillForm(pro, rowno) {
    activerowno = rowno;

    if (oldproduct == null) {
        filldata(pro);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(pro);
            }

        });
    }

}

function filldata(npro) {
    clearSelection(tblProduct);
    selectRow(tblProduct, activerowno, active);

    product = JSON.parse(JSON.stringify(npro));
    oldproduct = JSON.parse(JSON.stringify(npro));

    txtproductcode.value = product.productcode;
    txtproductname.value = product.productname;
    txtproductioncost.value = parseFloat(product.productioncost).toFixed(2);
    txtprofit.value = product.profitratio;
    cmbaddeddate.value = product.addeddate;
    txtDescription.value = product.description;


    //photo area fill --> if there any photo in selected row display them in the model view
    if (product.designedphoto != null){
        imgviewphoto.src = atob(product.designedphoto);
        picname.value = "";
        picname.style.border = initial;
    }else
        imgviewphoto.src = 'resources/image/noimage.png';
        imgviewphoto.style.display = "block";

    fillCombo(cmbdesigntye, "Select Design Type", designTypes, "name", product.designtype_id.dtype_id.name);
    fillCombo(cmbproducttype, "Select Product Type", producttype, "name", product.producttype_id.name);
    fillCombo(cmbdesigncode, "Select Design Code", designcodes, "designcode", product.designtype_id.designcode);
    fillCombo(cmbEmployee, "Select Employeee", employees, "callingname", product.employee_id.callingname);

    fillCombo(cmbproductstatus, "Select status", productstatus, "name", product.productstatus_id.name);
    cmbproductstatus.disabled = false;

    fillCombo(cmbMaterial, "Select Material", materials, "materialname", "");

    disableButtons(true, false, false);
    setStyle(valid);

      //check null statements
    if (product.description == null){
        txtDescription.style.border = initial;
    }

    refreshInnerForm();
    $('#formmodel').modal('show')

    cmbdesigncodeCH();
    cmbproducttypeCH();
}

function getUpdates() {

    var updates = "";

    if (product != null && oldproduct != null) {

        if (product.productcode != oldproduct.productcode)
            updates = updates + "\nProduct Code is Changed.." + oldproduct.productcode + " into " + product.productcode;

        if ( product.producttype_id.name != oldproduct.producttype_id.name)
            updates = updates + "\nProduct Type is Changed.." + oldproduct.producttype_id.name + " into " + product.producttype_id.name;

        if (product.designtype_id.designcode != oldproduct.designtype_id.designcode)
            updates = updates + "\nDesign Code is Changed.." + oldproduct.designtype_id.designcode + " into " + product.designtype_id.designcode;

        if (product.productname != oldproduct.productname)
            updates = updates + "\nProduct name is Changed.." + oldproduct.productname + " into " + product.productname;

        if (product.productioncost != oldproduct.productioncost)
            updates = updates + "\nProduct Cost is Changed.." + oldproduct.productioncost + " into " + product.productioncost;

        if (product.profitratio != oldproduct.profitratio)
            updates = updates + "\nProfit Ratio is Changed.." + oldproduct.profitratio + " into " + product.profitratio;

        if (product.addeddate != oldproduct.addeddate)
            updates = updates + "\nAdded Date is Changed.." + oldproduct.addeddate + " into " + product.addeddate;

        if (product.productstatus_id.name != oldproduct.productstatus_id.name)
            updates = updates + "\nProduct Status is Changed.." + oldproduct.productstatus_id.name + " into " + product.productstatus_id.name;

        if (product.description != oldproduct.description)
            updates = updates + "\nDescription is Changed.." + oldproduct.description + " into " + product.description;

        if (product.employee_id.callingname != oldproduct.employee_id.callingname)
            updates = updates + "\nEmployee is Changed.." + oldproduct.employee_id.callingname + " into " + product.employee_id.callingname;

        if (product.designedphoto != oldproduct.designedphoto)
            updates = updates + "\nDesigned Photo is Changed..";

        if (isEqualtolist(product.productHasMaterialList, oldproduct.productHasMaterialList , 'name'))
            updates = updates + "\nMaterial Name is Changed..";

        if (isEqualtolist(product.productHasMaterialList, oldproduct.productHasMaterialList , 'qty'))
            updates = updates + "\nMaterial Quantity is Changed..";

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
                title: "Are you sure to update following product details...?",
                text: "\n"+ getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/product", "PUT", product);
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

function btnDeleteMC(pro) {
    product = JSON.parse(JSON.stringify(pro));

    swal({
        title: "Are you sure to delete following Product...?",
        text: "\n Product Code : " + product.productcode +
            "\n Product  Type  : " + product.producttype_id.name,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/product", "DELETE", product);
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

function btnPrintTableMC(pro) {

    //open a new window for print table
    var newwindow = window.open();
    //get the table view for a variable
    formattab = tblProduct.outerHTML;

    //write the table for the new open tab
    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 50px; '> <h1>Product Details : </h1></div>" +
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