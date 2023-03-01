window.addEventListener("load", initialize);

//Initializing Functions

function initialize() {
    $('[data-toggle="tooltip"]').tooltip()

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

   txtSearchName.addEventListener("keyup", btnSearchMC);
   cmbproductionorder.addEventListener("change", cmbproductionorderCH);
   cmbproduct.addEventListener("change", cmbproductCH);
   txtdailyqty.addEventListener("keyup", txtdailyqtytCAL);

    privilages = httpRequest("../privilage?module=DAILYPRODUCT", "GET");

    //data list for form combo
    productionorders = httpRequest("../productionorder/listproductionbystatus", "GET");
    products = httpRequest("../product/list", "GET");
    employees = httpRequest("../employee/list", "GET");

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
    dailyproductions = new Array();
    var data = httpRequest("/daliyproduct/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) dailyproductions = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tbldailyproduct', dailyproductions, fillForm, btnDeleteMC, viewitem);
    clearSelection(tbldailyproduct);

    if (activerowno != "") selectRow(tbldailyproduct, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (olddailyproduction == null) {
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

    dailyproductionview = JSON.parse(JSON.stringify(pro));

    tblproductionorder.innerHTML =  dailyproductionview.productionorder_id.productionordercode;
    tblproduct.innerHTML =  dailyproductionview.product_id.productname;
    tblorderqty.innerHTML =  dailyproductionview.orderqty;
    tblcrntqty.innerHTML =  dailyproductionview.currentcomqty;
    tbldailyqty.innerHTML =  dailyproductionview.dailyqty;
    tbltotalqty.innerHTML = dailyproductionview.totalcomqty;
    tblbalanceqty.innerHTML = dailyproductionview.balanceqty;
    tbladdeddate.innerHTML = dailyproductionview.addeddate;
    tblemployee.innerHTML = dailyproductionview.employee_id.callingname;

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

function loadForm() {
    dailyproduction = new Object();
    olddailyproduction = null;

    fillCombo(cmbproductionorder, "Select Production", productionorders, "productionordercode", "");
    fillCombo(cmbproduct, "Select Product", products, "productname", "");
    fillCombo(cmbEmployee, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    dailyproduction.employee_id = JSON.parse(cmbEmployee.value);
    cmbEmployee.disabled = true;

    cmbaddeddate.value= getCurrentDateTime("date");
    dailyproduction.addeddate = cmbaddeddate.value;
    cmbaddeddate.disabled = true;
    cmbaddeddate.style.border = valid;

    cmbproductionorder.value = "";
    cmbproduct.value = "";
    txtorderqty.value = "";
    txtcrntqty.value = "";
    txtdailyqty.value = "";
    txttotalqty.value = "";
    txtbalanceqty.value = "";

    cmbproduct.disabled = true;
    txtorderqty.disabled = true;
    txttotalqty.disabled = true;
    txtbalanceqty.disabled = true;
    txtorderqty.disabled = true;
    txtcrntqty.disabled = true;
    setStyle(initial);
    cmbEmployee.style.border = valid;
    cmbaddeddate.style.border = valid;

    disableButtons(false, true, true);
}

function cmbproductionorderCH(){

    cmbproduct.value ="";
    cmbproduct.style.border = initial;
    productlistbtproductionorder = httpRequest("/product/byproductionorder?productionorderid=" + JSON.parse(cmbproductionorder.value).id, "GET");
    fillCombo(cmbproduct, "Select Product", productlistbtproductionorder, "productname", "");

    txtorderqty.value = "";
    dailyproduction.orderqty = null;
    txtorderqty.style.border = initial;
    cmbproduct.disabled = false;

    txtcrntqty.value = "";
    dailyproduction.currentcomqty = null;
    txtcrntqty.style.border = initial;

    txtdailyqty.value = "";
    dailyproduction.dailyqty = null;
    txtdailyqty.style.border = initial;

    txttotalqty.value = "";
    dailyproduction.totalcomqty = null;
    txttotalqty.style.border = initial;

    txtbalanceqty.value = "";
    dailyproduction.balanceqty = null;
    txtbalanceqty.style.border = initial;
}

function cmbproductCH(){
    var qtybyproduct = httpRequest("/productionorderhasproduct/objectbyproduct?productionorderid=" + JSON.parse(cmbproductionorder.value).id + "&productid=" + JSON.parse(cmbproduct.value).id , "GET");
    txtorderqty.value = JSON.parse(qtybyproduct.qty);
    dailyproduction.orderqty = txtorderqty.value;
    txtorderqty.style.border = valid;

    // final totalcomqty recode of the daily product by given production order and product
    var currentQuantitybyproduct = httpRequest("/daliyproduct/byproduct?productionorderid=" + JSON.parse(cmbproductionorder.value).id + "&productid=" + JSON.parse(cmbproduct.value).id , "GET");

    if (currentQuantitybyproduct.totalcomqty != null ){
        txtcrntqty.value = currentQuantitybyproduct.totalcomqty;
        dailyproduction.currentcomqty = txtcrntqty.value;
        txtcrntqty.style.border = valid;
    }else{
        txtcrntqty.value = "0";
        dailyproduction.currentcomqty = txtcrntqty.value;
        txtcrntqty.style.border = valid;
    }

    if (txtcrntqty.value == txtorderqty.value){

        txttotalqty.value = "";
        dailyproduction.totalcomqty = null;
        txttotalqty.style.border = initial;

        txtbalanceqty.value = 0;
        dailyproduction.balanceqty = null;
        txtbalanceqty.style.border = initial;

        txtdailyqty.disabled = true;
    }else {
        txtdailyqty.disabled = false;
        txttotalqty.value = "";
        dailyproduction.totalcomqty = null;
        txttotalqty.style.border = initial;

        txtbalanceqty.value = "";
        txtbalanceqty.style.border = initial;
    }

}

function txtdailyqtytCAL(){

    var balanceqty =  parseFloat(txtorderqty.value) - parseFloat(txtcrntqty.value);

    if (parseFloat(txtdailyqty.value) <= parseFloat(txtorderqty.value) && txtdailyqty.value <= parseFloat(balanceqty)){

        txttotalqty.value =  parseFloat(txtcrntqty.value) + parseFloat(txtdailyqty.value);
        dailyproduction.totalcomqty = txttotalqty.value;
        txttotalqty.style.border = valid;

        txtbalanceqty.value = parseFloat(txtorderqty.value) - parseFloat(txttotalqty.value);
        dailyproduction.balanceqty = txtbalanceqty.value;
        txtbalanceqty.style.border = valid;

    }else{
        swal({
            title: "You can not Enter This value....",
            icon: "error",
            button: true,
        });
        txtdailyqty.value= "";
        txtdailyqty.style.border = initial;
        dailyproduction.dailyqty = null;

        txtbalanceqty.value = "";
        txtbalanceqty.style.border = initial;
        dailyproduction.balanceqty = null;

        txttotalqty.value = "";
        txttotalqty.style.border = initial;
        dailyproduction.totalcomqty = null;
    }
}
function setStyle(style) {

    cmbproductionorder.style.border = style;
    cmbproduct.style.border = style;
    txtorderqty.style.border = style;
    txtcrntqty.style.border = style;
    txtdailyqty.style.border = style;
    txttotalqty.style.border = style;
    txtbalanceqty.style.border = style;
    cmbaddeddate.style.border = style;
    cmbEmployee.style.border = style;

}

function disableButtons(add, upd, del) {

    console.log(privilages)
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
/*
    // select deleted data row
    for (index in products) {
        if (products[index].productstatus_id.name == "Deleted") {
            tblProduct.children[1].children[index].style.color = "#f00";
            tblProduct.children[1].children[index].style.border = "2px solid red";
            tblProduct.children[1].children[index].lastChild.children[1].disabled = true;
            tblProduct.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }*/

}


function getErrors() {

    var errors = "";
    addvalue = "";

    if (dailyproduction.productionorder_id == null) {
        errors = errors + "\n" + "Production Order Not Selected";
        cmbproductionorder.style.border = invalid;
    } else addvalue = 1;

    if (dailyproduction.product_id == null) {
        errors = errors + "\n" + "product Not Selected";
        cmbproduct.style.border = invalid;
    } else addvalue = 1;

    if (dailyproduction.orderqty == null) {
        errors = errors + "\n" + "Order Quantity Not Enter";
        txtorderqty.style.border = invalid;
    } else addvalue = 1;

    if (dailyproduction.currentcomqty == null) {
        errors = errors + "\n" + "Current Quantity Not Enter";
        txtcrntqty.style.border = invalid;
    } else addvalue = 1;

    if (dailyproduction.dailyqty == null) {
        errors = errors + "\n" + "Daily Quantity Not Enter";
        txtdailyqty.style.border = invalid;
    } else addvalue = 1;

    if (dailyproduction.totalcomqty == null) {
        errors = errors + "\n" + "Total Quantity Not Enter";
        txttotalqty.style.border = invalid;
    } else addvalue = 1;

    if (dailyproduction.balanceqty == null) {
        errors = errors + "\n" + "Balance Quantity Not Enter";
        txtbalanceqty.style.border = invalid;
    } else addvalue = 1;

    if (dailyproduction.addeddate == null) {
        errors = errors + "\n" + "Added Date Not selected";
        cmbaddeddate.style.border = invalid;
    } else addvalue = 1;

    if (dailyproduction.employee_id == null) {
        errors = errors + "\n" + "Employee Not Selected";
        cmbEmployee.style.border = invalid;
    } else addvalue = 1;

    return errors;

}

function btnAddMC(){
    if(getErrors()==""){
        savedata();
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
        title: "Are you sure to add following Daily Product...?",
        text: "\nProduction Order Code  : " + dailyproduction.productionorder_id.productionordercode +
             "\nProduct  : " + dailyproduction.product_id.productname +
            "\nOrder Quantity : " + dailyproduction.orderqty +
            "\nCurrent Quantity : " + dailyproduction.currentcomqty +
            "\nDaily Quantity : " + dailyproduction.dailyqty +
            "\nTotal Quantity : " + dailyproduction.totalcomqty +
            "\nBalance Quantity : " + dailyproduction.balanceqty +
            "\nAdded date : " + dailyproduction.addeddate +
            "\nEmployee : " + dailyproduction.employee_id.callingname,

        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/daliyproduct", "POST", dailyproduction);
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

    if (olddailyproduction == null && addvalue == "") {
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

    if (olddailyproduction == null) {
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

function filldata(dp) {
    clearSelection(tbldailyproduct);
    selectRow(tbldailyproduct, activerowno, active);

    dailyproduction = JSON.parse(JSON.stringify(dp));
    olddailyproduction = JSON.parse(JSON.stringify(dp));

    txtorderqty.value = dailyproduction.orderqty;
    txtcrntqty.value = dailyproduction.currentcomqty;
    txtdailyqty.value = dailyproduction.dailyqty
    txttotalqty.value = dailyproduction.totalcomqty
    txtbalanceqty.value = dailyproduction.balanceqty;
    cmbaddeddate.value = dailyproduction.addeddate;

    fillCombo(cmbproductionorder, "", productionorders, "productionordercode", dailyproduction.productionorder_id.productionordercode);

    productlistbtproductionorder = httpRequest("/product/byproductionorder?productionorderid=" + JSON.parse(cmbproductionorder.value).id, "GET");
    fillCombo(cmbproduct, "Select Product", productlistbtproductionorder, "productname", dailyproduction.product_id.productname);
    cmbproduct.disabled = false;

    fillCombo(cmbEmployee, "Select Employeee", employees, "callingname", dailyproduction.employee_id.callingname);

    disableButtons(true, false, false);
    setStyle(valid);

    $('#formmodel').modal('show')

}

function getUpdates() {

    var updates = "";

    if (dailyproduction != null && olddailyproduction != null) {

        if (dailyproduction.productionorder_id.productionordercode != olddailyproduction.productionorder_id.productionordercode)
            updates = updates + "\nProduction Order is Changed.." + olddailyproduction.productionorder_id.productionordercode + " into " + dailyproduction.productionorder_id.productionordercode;

        if (dailyproduction.product_id.productname != olddailyproduction.product_id.productname)
            updates = updates + "\nProduct is Changed.." + olddailyproduction.product_id.productname + " into " + dailyproduction.product_id.productname;

        if ( dailyproduction.orderqty != olddailyproduction.orderqty)
            updates = updates + "\nOrder Quantity is Changed.." + olddailyproduction.orderqty + " into " + dailyproduction.orderqty;

        if (dailyproduction.currentcomqty != olddailyproduction.currentcomqty)
            updates = updates + "\nCurrent Quantity is Changed.." + olddailyproduction.currentcomqty + " into " + dailyproduction.currentcomqty;

        if (dailyproduction.dailyqty != olddailyproduction.dailyqty)
            updates = updates + "\nDaily Quantity is Changed.." + olddailyproduction.dailyqty + " into " + dailyproduction.dailyqty;

        if (dailyproduction.totalcomqty != olddailyproduction.totalcomqty)
            updates = updates + "\nTotal Quantity is Changed.." + olddailyproduction.totalcomqty + " into " + dailyproduction.totalcomqty;

        if (dailyproduction.balanceqty != olddailyproduction.balanceqty)
            updates = updates + "\nBalance Quantity is Changed.." + olddailyproduction.balanceqty + " into " + dailyproduction.balanceqty;

        if (dailyproduction.addeddate != olddailyproduction.addeddate)
            updates = updates + "\nAdded Date is Changed.." + olddailyproduction.addeddate + " into " + dailyproduction.addeddate;

        if (dailyproduction.employee_id.callingname != olddailyproduction.employee_id.callingname)
            updates = updates + "\nEmployee is Changed.." + olddailyproduction.employee_id.callingname + " into " + dailyproduction.employee_id.callingname;

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
                        var response = httpRequest("/daliyproduct", "PUT", dailyproduction);
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
    dailyproduction = JSON.parse(JSON.stringify(pro));

    swal({
        title: "Are you sure to delete following Daily Production...?",
        text: "\n Product Order : " +dailyproduction.productionorder_id.productionordercode  +
            "\n Product  : " + dailyproduction.product_id.productname,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/daliyproduct", "DELETE", dailyproduction);
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
        "<body><div style='margin-top: 50px; '> <h1>Daily Production Details : </h1></div>" +
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

    var cprop = tbldailyproduct.firstChild.firstChild.children[cindex].getAttribute('property');

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
    fillTable('tbldailyproduct', employees, fillForm, btnDeleteMC, viewitem);
    clearSelection(tbldailyproduct);
    loadForm();

    if (activerowno != "") selectRow(tbldailyproduct, activerowno, active);


}