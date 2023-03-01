window.addEventListener("load", initialize);

//Initializing Functions

function initialize() {
    $('[data-toggle="tooltip"]').tooltip()

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);


   txtSearchName.addEventListener("keyup", btnSearchMC);
   cmbcustomerorder.addEventListener("change", cmbcustomerorderCH);

    privilages = httpRequest("../privilage?module=PRODUCTIONORDER", "GET");

    //data list for form combo
    corders = httpRequest("../customerorder/list", "GET");
    productionorderstatus = httpRequest("../productionorderstatus/list", "GET");
    employees = httpRequest("../employee/list", "GET");

    //data list for inner combo
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
    disableButtons(false, true, true);
}

function loadTable(page, size, query) {
    page = page - 1;
    productionorders = new Array();
    var data = httpRequest("/productionorder/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) productionorders = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblProductionorder', productionorders, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblProductionorder);

    if (activerowno != "") selectRow(tblProductionorder, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldproductionorder == null) {
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
    productionorderview = JSON.parse(JSON.stringify(pro));

    tblproductionstatus.innerHTML = "";
    tblconfirmdate.innerHTML = "";
    tbladdedBy.innerHTML = "";
    tblproductonordercode.innerHTML =  productionorderview.productionordercode;
    tblcustomerorder.innerHTML =  productionorderview.corder_id.cordercode;
    tblrequiiredate.innerHTML =  productionorderview.requiredate;
    tbladdeddate.innerHTML = productionorderview.addeddate;
    tblproductionstatus.innerHTML = productionorderview.productionstatus_id.name;
    tblemployee.innerHTML = productionorderview.employee_id.callingname;

    if (productionorderview.productionstatus_id.name == "Confirmed"){
        tblconfirmdate.innerHTML = productionorderview.confirmdate;
        tbladdedBy.innerHTML = productionorderview.confirm_employee_id.callingname;
        fillInnerTable("tblInneMproductionorderProduct", productionorderview.productionorderHasMaterialList, fillInnerForm, btnInnerDeleteMC, viewinnerproductionorder)
        tblInneMproductionorderProduct.children[1].style.color="#000000";
        tblconfirmdate.style.color="#000000";
        tbladdedBy.style.color="#000000";
    }else {
        productionorderview.productionorderHasMaterialList = [];
        fillInnerTable("tblInneMproductionorderProduct", productionorderview.productionorderHasMaterialList, fillInnerForm, btnInnerDeleteMC, viewinnerproductionorder)
        tblInneMproductionorderProduct.children[1].align="center";
        tblInneMproductionorderProduct.children[1].style.color="#f00";
        tblInneMproductionorderProduct.children[1].innerHTML = "-";
        tbladdedBy.innerHTML = "-";
        tblconfirmdate.innerHTML = "-";
        tblconfirmdate.style.color="#f00";
        tbladdedBy.style.color="#f00";
    }

    fillInnerTable("tblPrintInnerProductionorder", productionorderview.productionorderHasProductList, fillInnerForm, btnInnerDeleteMC, viewinnerproductionorder)
    if (productionorderview.description != null){
        tbldescription.innerHTML =  productionorderview.description;
    }

    $('#viewmodal').modal('show')
}

function btnPrintrow() {

    var format = printformtable.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'></head>" +
        "<body><div style='margin-top: 150px'><h1>Production Order Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);

}

function cmbcustomerorderCH(){

    customerorderofrequiredate = [];
    customerorderofrequiredate = httpRequest("/customerorder/bycordercode?cordercode=" + JSON.parse(cmbcustomerorder.value).cordercode, "GET");
    cmbrequiredate.value = customerorderofrequiredate.requiredate;
    productionorder.requiredate = cmbrequiredate.value;
    cmbrequiredate.style.border = valid;


    //clear the arrays of inner and main to avoid the overwrite
    customerhasproductlist = [];
    productionorder.productionorderHasProductList = [];

    //get the service from producthasmaterial controller -->
    customerhasproductlist = httpRequest("/customerhasproduct/listbyproduct?customerid=" + JSON.parse(cmbcustomerorder.value).id, "GET");
    // read object array of this service one by one

    console.log(customerhasproductlist);
    for (var index in customerhasproductlist) {
        //creat a new object
        productionorderHasProduct = new Object();
        //set main object.property to service object that we get form the customerhasproduct controller
        productionorderHasProduct.product_id = customerhasproductlist[index].product_id;
        productionorderHasProduct.qty = customerhasproductlist[index].qty;
        productionorderHasProduct.requiredate = customerhasproductlist[index].requiredate;
       productionorderHasProduct.productionstatus_id = productionorderstatus[3];
       productionorderHasProduct.completedqty = 0;

        productionorder.productionorderHasProductList.push(productionorderHasProduct);

    }
    fillInnerTable("tblInnerproductionorder", productionorder.productionorderHasProductList, fillInnerForm, btnInnerDeleteMC, true);
}

function loadForm() {
    productionorder = new Object();
    oldproductionorder = null;

    //create array List
    productionorder.productionorderHasProductList = new Array();
    productionorder.productionorderHasMaterialList = new Array();

    fillCombo(cmbcustomerorder, "Select Customer", corders, "cordercode", "");
    fillCombo(cmbproductionstatus, "Select Status", productionorderstatus, "name", "Pending");
    fillCombo(cmbEmployee, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    productionorder.employee_id = JSON.parse(cmbEmployee.value);
    productionorder.productionstatus_id = JSON.parse(cmbproductionstatus.value);
    cmbEmployee.disabled = true;
    cmbproductionstatus.disabled = true;
    cmbrequiredate.disabled = true;

    cmbaddeddate.value= getCurrentDateTime("date");
    productionorder.addeddate = cmbaddeddate.value;
    cmbaddeddate.disabled = true;
    cmbaddeddate.style.border = valid;

    // Get Next Number Form Data Base
    var nextNumber = httpRequest("/productionorder/nextnumber", "GET");
    txtproductordercode.value = nextNumber.productionordercode;
    productionorder.productionordercode = txtproductordercode.value;
    txtproductordercode.disabled = "disabled";
    txtproductordercode.style.border = valid;

    cmbcustomerorder.value = "";
    cmbrequiredate.value = "";
    txtDescription.value = "";

    setStyle(initial);
    cmbaddeddate.style.border = valid;
    cmbproductionstatus.style.border = valid;
    cmbEmployee.style.border = valid;

    disableButtons(false, true, true);
    refreshInnerForm();
}


function refreshInnerForm() {

    productionorderHasProduct = new Object();
    oldproductionorderHasProduct = null;

    fillInnerTable("tblInnerproductionorder", productionorder.productionorderHasProductList, fillInnerForm, btnInnerDeleteMC, true);
    fillCombo(cmbproduct, "Select Product", products, "productname", "");
    fillCombo(cmbstatus, "Select status", productionorderstatus, "name", "");
    cmbstatus.disabled=false;

    cmbproduct.value ="";
    txtQuantity.value ="";
    cmbinnerrequiredate.value ="";
    txtComQuantity.value ="";
    cmbstatus.value ="";

    cmbproduct.style.border = initial;
    txtQuantity.style.border = initial;
    cmbinnerrequiredate.style.border = initial;
    txtComQuantity.style.border = initial;
    cmbstatus.style.border = initial;

    cmbproduct.disabled = false;
    cmbinnerrequiredate.disabled = false;

    btnInnerupdate.disabled = true;
    btnInnerAdd.disabled = true;
    btnInnerClear.disabled = true;

    cmbproduct.disabled = true;
    txtQuantity.disabled = true;
    cmbinnerrequiredate.disabled = true;
    txtComQuantity.disabled = true;
    cmbstatus.disabled = true;


}
function innerempty(){
    var innererrors = "";
    addinnervalue = "";

    if (productionorderHasProduct.product_id == null) {
        innererrors = innererrors + "\n" + "Product Not Selected";
        cmbproduct.style.border = invalid;
    } else addinnervalue = 1;

    if (productionorderHasProduct.qty == null) {
        innererrors = innererrors + "\n" + "Quantity Not Enter";
        txtQuantity.style.border = invalid;
    } else addinnervalue = 1;

    if (productionorderHasProduct.requiredate == null) {
        innererrors = innererrors + "\n" + "Require Date Not Enter";
        cmbinnerrequiredate.style.border = invalid;
    } else addinnervalue = 1;

    if (productionorderHasProduct.completedqty == null) {
        innererrors = innererrors + "\n" + "Complete Quantity Not Enter";
        txtComQuantity.style.border = invalid;
    } else addinnervalue = 1;

    if (productionorderHasProduct.productionstatus_id == null) {
        innererrors = innererrors + "\n" + "Product Status Not Enter";
        cmbstatus.style.border = invalid;
    } else addinnervalue = 1;

    return innererrors;
}

function btnInnerAddMc() {

    var matext = false;
    if (innerempty()==""){
        for (var index in productionorder.productionorderHasProductList) {
            if (productionorder.productionorderHasProductList[index].product_id.productname == productionorderHasProduct.product_id.productname) {
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
            productionorder.productionorderHasProductList.push(productionorderHasProduct);
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

function getInnerUpdates() {

    var innerupdates = "";

    if(productionorderHasProduct!=null && oldproductionorderHasProduct !=null) {
        if (productionorderHasProduct.qty != oldproductionorderHasProduct.qty)
            innerupdates = innerupdates + "\nQuantity Changed.." + oldproductionorderHasProduct.qty + " into " + productionorderHasProduct.qty;
    }

    if(productionorderHasProduct!=null && oldproductionorderHasProduct !=null) {
        if (productionorderHasProduct.completedqty != oldproductionorderHasProduct.completedqty)
            innerupdates = innerupdates + "\nCompleted Quantity Changed.." + oldproductionorderHasProduct.completedqty + " into " + productionorderHasProduct.completedqty;
    }

    if(productionorderHasProduct!=null && oldproductionorderHasProduct !=null) {
        if (productionorderHasProduct.productionstatus_id.name != oldproductionorderHasProduct.productionstatus_id.name)
            innerupdates = innerupdates + "\nStatus is Changed.." + oldproductionorderHasProduct.productionstatus_id.name + " into " + productionorderHasProduct.productionstatus_id.name;
    }
    return innerupdates;
}

function fillInnerForm(ob, innrrowno) {

    innerrow = innrrowno;
    productionorderHasProduct = JSON.parse(JSON.stringify(ob));
    oldproductionorderHasProduct = JSON.parse(JSON.stringify(ob));
    btnInnerupdate.disabled = false;
    btnInnerAdd.disabled = true;

    fillCombo(cmbproduct, "Select Product", products, "productname", productionorderHasProduct.product_id.productname);
    fillCombo(cmbstatus, "Select Status", productionorderstatus, "name", productionorderHasProduct.productionstatus_id.name);
    cmbstatus.disabled=true;
    cmbproduct.disabled=true;
    cmbinnerrequiredate.disabled=true;

    txtQuantity.value = productionorderHasProduct.qty;
    cmbinnerrequiredate.value = productionorderHasProduct.requiredate;
    txtComQuantity.value = productionorderHasProduct.completedqty;

    txtQuantity.style.border = valid;
    cmbinnerrequiredate.style.border = valid;
    txtComQuantity.style.border = valid;
    cmbstatus.style.border = valid;


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
        if(innerempty() == ""){

            productionorder.productionorderHasProductList[innerrow] = productionorderHasProduct;
            refreshInnerForm();
        }else{
            swal({
               title: "You have following errors",
               text: "\n"+innerempty(),
               icon: "error",
               button: true,
            });

        }
    }
}
function viewinnerproductionorder(){

}
function btnInnerDeleteMC(innerob, innerrow) {

    swal({
        title: "Are you sure to Delete following Product...?",

        text: "\nProduct Name :" + innerob.product_id.productname,
        icon: "warning", buttons: true, dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                productionorder.productionorderHasProductList.splice(innerrow, 1)
                refreshInnerForm();
            }
        });

}

function btnInnerclearMc(){

    checkerr = innerempty();

    if (productionorderHasProduct == null && addinnervalue == "") {
        refreshInnerForm();
    } else {
        swal({
            className:"innermasserposition2",
            title: "Inner Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                refreshInnerForm();
            }

        });
    }


}

function setStyle(style) {

    cmbcustomerorder.style.border = style;
    cmbrequiredate.style.border = style;
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

    for (index in productionorders){
        if (productionorders[index].productionstatus_id.name == "Confirmed"){
            tblProductionorder.children[1].children[index].lastChild.children[0].disabled = true;
            tblProductionorder.children[1].children[index].lastChild.children[0].style.cursor = "not-allowed";
        }

    }

    // select deleted data row
    for (index in productionorders) {
        if (productionorders[index].productionstatus_id.name == "Deleted") {
            tblProductionorder.children[1].children[index].style.color = "#f00";
            tblProductionorder.children[1].children[index].style.border = "2px solid red";
            tblProductionorder.children[1].children[index].lastChild.children[1].disabled = true;
            tblProductionorder.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}


function getErrors() {

    var errors = "";
    addvalue = "";

    if (productionorder.productionordercode == null) {
        errors = errors + "\n" + "production Code Not Enter";
        txtproductordercode.style.border = invalid;
    } else addvalue = 1;

    if (productionorder.corder_id == null) {
        errors = errors + "\n" + "Customer Not Selected";
        cmbcustomerorder.style.border = invalid;
    } else addvalue = 1;

    if (productionorder.requiredate == null) {
        errors = errors + "\n" + "Require Date Not Selected";
        cmbrequiredate.style.border = invalid;
    } else addvalue = 1;

    if (productionorder.addeddate == null) {
        errors = errors + "\n" + "Added Date Not Selected";
        cmbaddeddate.style.border = invalid;
    } else addvalue = 1;

    if (productionorder.addeddate == null) {
        errors = errors + "\n" + "Added Date Not selected";
        cmbaddeddate.style.border = invalid;
    } else addvalue = 1;

    if (productionorder.productionstatus_id == null) {
        errors = errors + "\n" + "Status Not Selected";
        cmbproductionstatus.style.border = invalid;
    } else addvalue = 1;

    if (productionorder.employee_id == null) {
        errors = errors + "\n" + "Employee Not Selected";
        cmbEmployee.style.border = invalid;
    } else addvalue = 1;

    if (productionorder.productionorderHasProductList.length == 0) {
            errors = errors + "\n" + "Empty Inner Product Details";
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
        text: "\nProduction Order Code : " + productionorder.productionordercode +
            "\nCustomer Order : " + productionorder.corder_id.cordercode +
            "\nRequire Date : " + productionorder.requiredate +
            "\nAdded date : " + productionorder.addeddate +
            "\nStatus: " + productionorder.productionstatus_id.name +
            "\nEmployee : " + productionorder.employee_id.callingname,

        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/productionorder", "POST", productionorder);
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

    if (oldproductionorder == null && addvalue == "") {
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

function fillForm(por, rowno) {
    activerowno = rowno;

    if (oldproductionorder == null) {
        filldata(por);

    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(por);
            }

        });
    }

}


function filldata(pder) {
    clearSelection(tblProductionorder);
    selectRow(tblProductionorder, activerowno, active);

    productionorder = JSON.parse(JSON.stringify(pder));
    oldproductionorder = JSON.parse(JSON.stringify(pder));

    txtproductordercode.value = productionorder.productionordercode;
    cmbrequiredate.value = productionorder.requiredate;
    txtDescription.value = productionorder.description;
    cmbaddeddate.value = productionorder.addeddate;

    fillCombo(cmbcustomerorder, "Select Customer", corders, "cordercode", productionorder.corder_id.cordercode);
    fillCombo(cmbproductionstatus, "Select Status", productionorderstatus, "name", productionorder.productionstatus_id.name);
    cmbproductionstatus.disabled = false;

    fillCombo(cmbEmployee, "Select Emloyee", employees, "callingname", productionorder.employee_id.callingname);

    disableButtons(true, false, false);
    setStyle(valid);

      //check null statements
    if (productionorder.description == null){
        txtDescription.style.border = initial;
    }

    refreshInnerForm();
    $('#formmodel').modal('show')
    cmbrequiredate.style.border = valid;
    cmbcustomerorder.style.border = valid;


}

function getUpdates() {

    var updates = "";

    if (productionorder != null && oldproductionorder != null) {

        if (productionorder.productionordercode != oldproductionorder.productionordercode)
            updates = updates + "\nProduct Code is Changed.." + oldproductionorder.productionordercode + " into " + productionorder.productionordercode;

        if ( productionorder.corder_id.cordercode != oldproductionorder.corder_id.cordercode)
            updates = updates + "\nCustomer Code is Changed.." + oldproductionorder.corder_id.cordercode + " into " + productionorder.corder_id.cordercode;

        if (productionorder.requiredate != oldproductionorder.requiredate)
            updates = updates + "\nRequire Date is Changed.." + oldproductionorder.requiredate + " into " + productionorder.requiredate;

        if (productionorder.description != oldproductionorder.description)
            updates = updates + "\nDescription is Changed..";

        if (productionorder.addeddate != oldproductionorder.addeddate)
            updates = updates + "\nAdded Date is Changed.." + oldproductionorder.addeddate + " into " + productionorder.addeddate;

        if (productionorder.productionstatus_id.name != oldproductionorder.productionstatus_id.name)
            updates = updates + "\nProduction status is Changed.." + oldproductionorder.productionstatus_id.name + " into " + productionorder.productionstatus_id.name;

        if (productionorder.employee_id.callingname != oldproductionorder.employee_id.callingname)
            updates = updates + "\nEmployee is Changed.." + oldproductionorder.employee_id.callingname + " into " + productionorder.employee_id.callingname;

        if (isEqual(productionorder.productionorderHasProductList, oldproductionorder.productionorderHasProductList , 'product_id'))
            updates = updates + "\nProduct is Changed..";

        if (isEqualtolist(productionorder.productionorderHasProductList, oldproductionorder.productionorderHasProductList , 'qty'))
            updates = updates + "\nQuantity is Changed..";

        if (isEqualtolist(productionorder.productionorderHasProductList, oldproductionorder.productionorderHasProductList , 'completedqty'))
            updates = updates + "\nComplete Quantity is Changed..";
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
                        var response = httpRequest("/productionorder", "PUT", productionorder);
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
    productionorder = JSON.parse(JSON.stringify(pro));

    swal({
        title: "Are you sure to delete following Production Order...?",
        text: "\n Production Order Code : " + productionorder.productionordercode +
            "\n Customer Code  : " + productionorder.corder_id.cordercode,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/productionorder", "DELETE", productionorder);
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