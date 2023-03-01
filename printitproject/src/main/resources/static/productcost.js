window.addEventListener("load", initialize);

//Initializing Functions

function initialize() {
    $('[data-toggle="tooltip"]').tooltip()

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);
    $('.js-example-basic-single').select2();

    txtSearchName.addEventListener("keyup", btnSearchMC);
    //cmbproduct.addEventListener("change", cmbproductCH);

    privilages = httpRequest("../privilage?module=PRODUCTCOST", "GET");

    //data list for form combo
    pcoststatus = httpRequest("../pcoststatus/list", "GET");
    product = httpRequest("../product/list", "GET");
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
    productcostanalysies = new Array();
    var data = httpRequest("/productcostanalysis/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) productcostanalysies = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblProductcost', productcostanalysies, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblProductcost);

    if (activerowno != "") selectRow(tblProductcost, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldproductcost == null) {
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

function viewitem(pca, rowno) {

    productcostview = JSON.parse(JSON.stringify(pca));

    tblpcacode.innerHTML = productcostview.productcostanalysiscode;
    tblcmbproduct.innerHTML = productcostview.product_id.productname;
    tblmaterialcost.innerHTML = parseFloat(productcostview.materialcost).toFixed(2);
    tblproductioncost.innerHTML = parseFloat(productcostview.productioncost).toFixed(2);
    tbltotalcost.innerHTML = parseFloat(productcostview.totalcost).toFixed(2);
    tblprofitratio.innerHTML = productcostview.profitratio;
    tblsalesprice.innerHTML = parseFloat(productcostview.salesprice).toFixed(2);
    tblvalidfrom.innerHTML = productcostview.validfrom;
    tblvalidto.innerHTML = productcostview.validto;
    tbladdeddate.innerHTML = productcostview.addeddate
    tblemployee.innerHTML = productcostview.employee_id.callingname;
    tbldescription.innerHTML = productcostview.description;
    tblcmbstatus.innerHTML = productcostview.pcoststatus_id.name;


    fillInnerTable("tblPrintInnerMaterial", productcostview.productcostanalysisHasMaterialList, fillInnerForm, btnInnerDeleteMC, viewInnerMaterial)
    $('#rowviwmodal').modal('show')

}

function btnPrintrow() {

    var format = printformtable.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'></head>" +
        "<body><div style='margin-top: 150px'><h1>Product Cost Analysis Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);

}

function cmbproductCH() {
    //clear the arrays of inner and main to avoid the overwrite
    producthasmateriallist = [];
    productcost.productcostanalysisHasMaterialList = [];

    //get the service from producthasmaterial controller -->
    producthasmateriallist = httpRequest("/producthasmaterial/listbyproduct?productid=" + JSON.parse(cmbproduct.value).id, "GET");
    // read object array of this service one by one
    for (var index in producthasmateriallist) {
        //creat a new object
        productcostanalysisHasMaterial = new Object();
        //set main object.property to service object that we get form the producthasmaterial controller
        productcostanalysisHasMaterial.material_id = producthasmateriallist[index].material_id;
        productcostanalysisHasMaterial.qty = producthasmateriallist[index].qty;
        productcostanalysisHasMaterial.cost = (parseFloat(producthasmateriallist[index].qty) * parseFloat(producthasmateriallist[index].material_id.purchaseprice)).toFixed(2);
        productcost.productcostanalysisHasMaterialList.push(productcostanalysisHasMaterial);
    }

    // when product change set the value to production cost and profit ratio to there fields and bind them to there properties
    productioncost = JSON.parse(cmbproduct.value).productioncost;
    txtproductioncost.value = parseFloat(productioncost).toFixed(2)
    txtprofitratio.value = JSON.parse(cmbproduct.value).profitratio;
    productcost.productioncost = txtproductioncost.value;
    productcost.profitratio = txtprofitratio.value;

    txtprofitratio.style.border = valid;
    txtproductioncost.style.border = valid;

    refreshInnerForm();

    // Valid To
    dtavalidto.disabled = false;
    dtavalidto.min = getCurrentDateTime("date");
    let vtday = new Date();
    let validtoafteroneweek = new Date();
    validtoafteroneweek.setDate(vtday.getDate() + 20);
    let vmonth = validtoafteroneweek.getMonth() + 1;
    if (vmonth < 10) vmonth = "0" + vmonth;
    let vday = validtoafteroneweek.getDate();
    if (vday < 10) vday = "0" + vday;
    dtavalidto.max = validtoafteroneweek.getFullYear() + "-" + vmonth + "-" + vday;

    /*lastpcabyproduct = httpRequest("/productcostanalysis/lastpca?productid=" + JSON.parse(cmbproduct.value).id, "GET");

    var lastvaliddate = lastpcabyproduct.validto;*/

    dtavalidfrom.value= getCurrentDateTime("date");
    productcost.validfrom = dtavalidfrom.value;
    dtavalidfrom.disabled = true;
    dtavalidfrom.style.border = valid;


}

function loadForm() {
    productcost = new Object();
    oldproductcost = null;

    //create array List

    productcost.productcostanalysisHasMaterialList = new Array();

    fillCombo(cmbstatus, "Select Status", pcoststatus, "name", "Completed");
    fillCombo(cmbproduct, "Select Product", product, "productname", "");
    fillCombo(cmbEmployee, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);

    productcost.employee_id = JSON.parse(cmbEmployee.value);
    cmbEmployee.disabled = true;
    productcost.pcoststatus_id = JSON.parse(cmbstatus.value);
    cmbstatus.disabled = true;

    dtaaddeddate.value = getCurrentDateTime("date");
    productcost.addeddate = dtaaddeddate.value;
    dtaaddeddate.disabled = true;
    dtaaddeddate.style.border = valid;

    // Get Next Number Form Data Base
    var nextNumber = httpRequest("/productcostanalysis/nextnumber", "GET");
    txtpcacode.value = nextNumber.productcostanalysiscode;
    productcost.productcostanalysiscode = txtpcacode.value;
    txtpcacode.disabled = "disabled";
    txtpcacode.style.border = valid;

    cmbproduct.value = "";
    txtmaterialcost.value = "";
    txtproductioncost.value = "";
    txttotalcost.value = "";
    txtprofitratio.value = "";
    txtsalesprice.value = "";
    dtavalidfrom.value = "";
    dtavalidto.value = "";

    setStyle(initial);
    cmbstatus.style.border = valid;
    cmbEmployee.style.border = valid;
    dtaaddeddate.style.border = valid;

    txtmaterialcost.disabled = true;
    txtproductioncost.disabled = true;
    txttotalcost.disabled = true;
    txtprofitratio.disabled = true;
    txtsalesprice.disabled = true;
    dtavalidto.disabled = true;
    dtavalidfrom.disabled = true;

    txtmaterialcost.value = "0.00";
    txtproductioncost.value = "0.00";
    txttotalcost.value = "0.00";
    txtprofitratio.value = "0%";
    txtsalesprice.value = "0.00";

    disableButtons(false, true, true);
    refreshInnerForm();
}


function refreshInnerForm() {

    productcostanalysisHasMaterial = new Object();
    oldproductcostanalysisHasMaterial = null;

    materialcost = 0;

    // fill inner table function
    fillInnerTable("tblInnerMaterial", productcost.productcostanalysisHasMaterialList, fillInnerForm, btnInnerDeleteMC, false)

    //if there any inner table data if condition will be true
    if (productcost.productcostanalysisHasMaterialList.length != 0) {
        //read the inner array one by one
        for (var index in productcost.productcostanalysisHasMaterialList) {
            //after read one by one set all the total of the cost column in to the materialcost variable
            materialcost = (parseFloat(materialcost) + parseFloat(productcost.productcostanalysisHasMaterialList[index].cost)).toFixed(2);
        }
        // set value to the field and bind them to the property
        txtmaterialcost.value = materialcost;
        productcost.materialcost = txtmaterialcost.value;

        // total cost = material cost + production cost
        txttotalcost.value = (parseFloat(productcost.materialcost) + parseFloat(productcost.productioncost)).toFixed(2);
        productcost.totalcost = txttotalcost.value;
        txttotalcost.style.border = valid;

        // set the sale price to field and bind the value to property
        // sale price = total cost x profit ratio / 100
        txtsalesprice.value = (parseFloat(txttotalcost.value) * parseFloat(txtprofitratio.value)).toFixed(2)
        totalsaleprice = parseFloat(txtsalesprice.value / 100);
        txtsalesprice.value = (parseFloat(totalsaleprice) + parseFloat(txttotalcost.value)).toFixed(2)
        productcost.salesprice = txtsalesprice.value;
        txtsalesprice.style.border = valid;

        if (oldproductcost != null && productcost.materialcost != oldproductcost.materialcost) {
            txtmaterialcost.style.border = updated;
        } else {
            txtmaterialcost.style.border = valid;
        }
        if (oldproductcost != null && productcost.productioncost != oldproductcost.productioncost) {
            txtproductioncost.style.border = updated;
        } else {
            txtproductioncost.style.border = valid;
        }
        if (oldproductcost != null && productcost.totalcost != oldproductcost.totalcost) {
            txttotalcost.style.border = updated;
        } else {
            txttotalcost.style.border = valid;
        }
        if (oldproductcost != null && productcost.profitratio != oldproductcost.profitratio) {
            txtprofitratio.style.border = updated;
        } else {
            txtprofitratio.style.border = valid;
        }
        if (oldproductcost != null && productcost.salesprice != oldproductcost.salesprice) {
            txtsalesprice.style.border = updated;
        } else {
            txtsalesprice.style.border = valid;
        }
    } else {
        txtmaterialcost.value = "0.00";
        txtproductioncost.value = "0.00";
        txttotalcost.value = "0.00";
        txtprofitratio.value = "0%";
        txtsalesprice.value = "0.00";
        cmbproduct.value = "";

        txtmaterialcost.style.border = initial;
        txtproductioncost.style.border = initial;
        txttotalcost.style.border = initial;
        txtprofitratio.style.border = initial;
        txtsalesprice.style.border = initial;
        cmbproduct.style.border = initial;

        productcost.materialcost = null;
        productcost.productioncost = null;
        productcost.totalcost = null;
        productcost.profitratio = null;
        productcost.salesprice = null;
        productcost.product_id = null;

    }
}

function checkinnerempty() {
    var error = "";

    if (productcostanalysisHasMaterial.material_id == null) {
        error = error + "\n" + "Select A Material...!";
        cmbMaterial.style.border = invalid;
    }
    return error;

}

function btnInnerAddMc() {

    if (checkinnerempty() == "") {

        let matext = false;
        for (let index in productcost.productcostanalysisHasMaterialList) {
            if (productcost.productcostanalysisHasMaterialList[index].material_id.materialname == productcostanalysisHasMaterial.material_id.materialname) {
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

            productcost.productcostanalysisHasMaterialList.push(productcostanalysisHasMaterial);
            refreshInnerForm();
        }
    } else {
        swal({
            title: "You have following errors",
            text: "\n" + checkinnerempty(),
            icon: "error",
            button: true,
        });

    }


}

function fillInnerForm(ob, innrrowno) {

    innerrow = innrrowno
    productcostanalysisHasMaterial = JSON.parse(JSON.stringify(ob));
    oldproductcostanalysisHasMaterial = JSON.parse(JSON.stringify(ob));
    btnInnerupdate.disabled = false;
    btnInnerAdd.disabled = true;

    fillCombo(cmbMaterial, "Select Material", materials, "materialname", productcostanalysisHasMaterial.material_id.materialname);
    cmbMaterial.style.border = valid;
    cmbMaterial.disabled = true;
    cmbcost.value = parseFloat(productcostanalysisHasMaterial.cost).toFixed(2);
    cmbcost.style.border = valid;
    txtquantity.value = productcostanalysisHasMaterial.qty;
    txtquantity.style.border = valid;
}

function getInnerUpdates() {

    var innerupdates = "";

    if (productcostanalysisHasMaterial != null && oldproductcostanalysisHasMaterial != null) {

        if (productcostanalysisHasMaterial.qty != oldproductcostanalysisHasMaterial.qty)
            innerupdates = innerupdates + "\nQuantity Changed.." + oldproductcostanalysisHasMaterial.qty + " into " + productcostanalysisHasMaterial.qty;

        if (productcostanalysisHasMaterial.cost != oldproductcostanalysisHasMaterial.cost)
            innerupdates = innerupdates + "\nCost Changed.." + oldproductcostanalysisHasMaterial.cost + " into " + productcostanalysisHasMaterial.cost;


    }
    return innerupdates;
}

function btnInnerupdateMc() {

    var innerupdate = getInnerUpdates();
    if (innerupdate == "") {
        swal({
            className: "innermasserposition",
            text: '\n Nothing Updated..!',
            button: false,
            timer: 1200
        });
    } else {
        if (checkinnerempty() == "") {

            productcost.productcostanalysisHasMaterialList[innerrow] = productcostanalysisHasMaterial;
            refreshInnerForm();
            btnInnerupdate.disabled = true;

        } else {
            swal({
                title: "You have following errors",
                text: "\n" + checkinnerempty(),
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
                productcost.productcostanalysisHasMaterialList.splice(innerrow, 1)
                refreshInnerForm();
            }
        });

}

function viewInnerMaterial() {
}

function setStyle(style) {

    $("#productcostselect2parent .select2-container").css('border',style);
    txtmaterialcost.style.border = style;
    txtproductioncost.style.border = style;
    txttotalcost.style.border = style;
    txtprofitratio.style.border = style;
    txtsalesprice.style.border = style;
    dtavalidfrom.style.border = style;
    dtavalidto.style.border = style;
    dtaaddeddate.style.border = style;
    cmbstatus.style.border = style;
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
    for (index in productcostanalysies) {
        if (productcostanalysies[index].pcoststatus_id.name == "Deleted") {
            tblProductcost.children[1].children[index].style.color = "#f00";
            tblProductcost.children[1].children[index].style.border = "2px solid red";
            tblProductcost.children[1].children[index].lastChild.children[1].disabled = true;
            tblProductcost.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}


function getErrors() {

    var errors = "";
    addvalue = "";

    if (productcost.productcostanalysiscode == null) {
        errors = errors + "\n" + "Product Cost Code Not Enter";
        txtpcacode.style.border = invalid;
    } else addvalue = 1;

    if (productcost.product_id == null) {
        errors = errors + "\n" + "Product Name Not Selected";
        $("#productcostselect2parent .select2-container").css('border',invalid);
    } else addvalue = 1;

    if (productcost.materialcost == null) {
        errors = errors + "\n" + "Material Cost Not Enter";
        txtmaterialcost.style.border = invalid;
    } else addvalue = 1;

    if (productcost.productioncost == null) {
        errors = errors + "\n" + "Production Cost Not Enter";
        txtproductioncost.style.border = invalid;
    } else addvalue = 1;

    if (productcost.totalcost == null) {
        errors = errors + "\n" + "Total Cost Not Enter";
        txttotalcost.style.border = invalid;
    } else addvalue = 1;

    if (productcost.profitratio == null) {
        errors = errors + "\n" + "Profit Ratio Not Enter";
        txtprofitratio.style.border = invalid;
    } else addvalue = 1;

    if (productcost.salesprice == null) {
        errors = errors + "\n" + "Sales Price Not Enter";
        txtsalesprice.style.border = invalid;
    } else addvalue = 1;

    if (productcost.validfrom == null) {
        errors = errors + "\n" + "Valid Date Not Enter(from)";
        dtavalidfrom.style.border = invalid;
    } else addvalue = 1;

    if (productcost.validto == null) {
        errors = errors + "\n" + "Valid Date Not Enter(To)";
        dtavalidto.style.border = invalid;
    } else addvalue = 1;

    if (productcost.addeddate == null) {
        errors = errors + "\n" + "Added Date Not Selected";
        dtaaddeddate.style.border = invalid;
    } else addvalue = 1;

    if (productcost.pcoststatus_id == null) {
        errors = errors + "\n" + "Status Not Selected";
        cmbstatus.style.border = invalid;
    } else addvalue = 1;

    if (productcost.employee_id.callingname == null) {
        errors = errors + "\n" + "Employee Not Selected";
        cmbEmployee.style.border = invalid;
    } else addvalue = 1;

    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (txtdescription.value == "") {
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

        } else {
            savedata();
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
        title: "Are you sure to add following Product Cost...?",
        text: "\nPCA Code : " + productcost.productcostanalysiscode +
            "\nProduct Name : " + productcost.product_id.productname +
            "\nMaterial Cost : " + productcost.materialcost +
            "\nProduct Cost : " + productcost.productioncost +
            "\nTotal Cost : " + productcost.totalcost +
            "\nProfit Ratio : " + productcost.profitratio +
            "\nSales Price : " + productcost.salesprice +
            "\nValid To : " + productcost.validto +
            "\nValid From : " + productcost.validfrom +
            "\nAdded Date : " + productcost.addeddate +
            "\nStatus : " + productcost.pcoststatus_id.name +
            "\nEmployee : " + productcost.employee_id.callingname,


        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/productcostanalysis", "POST", productcost);
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

    if (oldproductcost == null && addvalue == "") {
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

    if (oldproductcost == null) {
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


function filldata(pca) {
    clearSelection(tblProductcost);
    selectRow(tblProductcost, activerowno, active);

    productcost = JSON.parse(JSON.stringify(pca));
    oldproductcost = JSON.parse(JSON.stringify(pca));

    txtpcacode.value = productcost.productcostanalysiscode;
    txtmaterialcost.value = parseFloat(productcost.materialcost).toFixed(2);
    txtproductioncost.value = parseFloat(productcost.productioncost).toFixed(2);
    txttotalcost.value = parseFloat(productcost.totalcost).toFixed(2);
    txtprofitratio.value =productcost.profitratio;
    txtsalesprice.value = parseFloat(productcost.salesprice).toFixed(2);
    dtavalidfrom.value = productcost.validfrom;
    dtavalidto.value = productcost.validto;
    dtaaddeddate.value = productcost.addeddate;
    txtdescription.value = productcost.description;

    fillCombo(cmbstatus, "Select Status", pcoststatus, "name", productcost.pcoststatus_id.name);
    fillCombo(cmbproduct, "Select Product", product, "productname", productcost.product_id.productname);
    fillCombo(cmbEmployee, "Select Employeee", employees, "callingname", productcost.employee_id.callingname);
    cmbstatus.disabled = false;

    disableButtons(true, false, false);
    setStyle(valid);

    //check null statements
    if (productcost.description == null) {
        txtdescription.style.border = initial;
    }
    refreshInnerForm();
    $('#formmodel').modal('show')


}

function getUpdates() {

    var updates = "";

    if (productcost != null && oldproductcost != null) {

        if (productcost.productcostanalysiscode != oldproductcost.productcostanalysiscode)
            updates = updates + "\nPCA Code is Changed.." + oldproductcost.productcostanalysiscode + " into " + productcost.productcostanalysiscode;

        if (productcost.product_id.productname != oldproductcost.product_id.productname)
            updates = updates + "\nProduct Name is Changed.." + oldproductcost.product_id.productname + " into " + productcost.product_id.productname;

        if (productcost.materialcost != oldproductcost.materialcost)
            updates = updates + "\nMaterial is Changed.." + oldproductcost.materialcost + " into " + productcost.materialcost;

        if (productcost.productioncost != oldproductcost.productioncost)
            updates = updates + "\nProduct Cost is Changed.." + oldproductcost.productioncost + " into " + productcost.productioncost;

        if (productcost.totalcost != oldproductcost.totalcost)
            updates = updates + "\nTotal Cost is Changed.." + oldproductcost.totalcost + " into " + productcost.totalcost;

        if (productcost.profitratio != oldproductcost.profitratio)
            updates = updates + "\nProfit Ratio is Changed.." + oldproductcost.profitratio + " into " + productcost.profitratio;

        if (productcost.salesprice != oldproductcost.salesprice)
            updates = updates + "\nSale Price is Changed.." + oldproductcost.salesprice + " into " + productcost.salesprice;

        if (productcost.validto != oldproductcost.validto)
            updates = updates + "\nValid Date (from) is Changed.." + oldproductcost.validto + " into " + productcost.validto;

        if (productcost.validfrom != oldproductcost.validfrom)
            updates = updates + "\nValid From is Changed.." + oldproductcost.validfrom + " into " + productcost.validfrom;

        if (productcost.addeddate != oldproductcost.addeddate)
            updates = updates + "\nAdded Date is Changed.." + oldproductcost.addeddate + " into " + productcost.addeddate;

        if (productcost.description != oldproductcost.description)
            updates = updates + "\nDescription is Changed.." + oldproductcost.description + " into " + productcost.description;

        if (productcost.pcoststatus_id.name != oldproductcost.pcoststatus_id.name)
            updates = updates + "\nStatus is Changed.." + oldproductcost.pcoststatus_id.name + " into " + productcost.pcoststatus_id.name;

        if (productcost.employee_id.callingname != oldproductcost.employee_id.callingname)
            updates = updates + "\nEmployee is Changed.." + oldproductcost.employee_id.callingname + " into " + productcost.employee_id.callingname;

        if (isEqual(productcost.productcostanalysisHasMaterialList, oldproductcost.productcostanalysisHasMaterialList, 'material_id'))
            updates = updates + "\nMaterial is Changed..";

    }

    return updates;

}

function btnUpdateMC() {
    var errors = getErrors();
    if (errors == "") {
        var updates = getUpdates();
        if (updates == "")
            swal({
                title: 'Nothing Updated..!', icon: "warning",
                text: '\n',
                button: false,
                timer: 1200
            });
        else {
            swal({
                title: "Are you sure to update following Product Cost details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/productcostanalysis", "PUT", productcost);
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

                        } else {
                            swal({
                                title: 'Failed to Update as', icon: "error",
                                text: '\n ' + response,
                                button: true
                            });
                        }
                    }
                });
        }
    } else
        swal({
            title: 'You have following errors in your form', icon: "error",
            text: '\n ' + getErrors(),
            button: true
        });

}

function btnDeleteMC(pca) {
    productcost = JSON.parse(JSON.stringify(pca));

    swal({
        title: "Are you sure to delete following Product Cost...?",
        text: "\n PCA Number : " + productcost.productcostanalysiscode +
            "\n Material Cost  : " + productcost.materialcost,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/productcostanalysis", "DELETE", productcost);
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
    formattab = tblProductcost.outerHTML;

    //write the table for the new open tab
    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 50px; '> <h1>Product Cost Analysis Details : </h1></div>" +
        "<div>" + formattab + "</div>" +
        "</body>" +
        "</html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}

function closeviewmodule() {

    var update = getUpdates()
    var errors = getErrors();
    if (errors == "" && update == "") {
        $('#formmodel').modal('hide')
        loadForm();
    } else
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