window.addEventListener("load", initialize);

//Initializing Functions

function initialize() {
    $('[data-toggle="tooltip"]').tooltip()

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    txtSearchName.addEventListener("keyup", btnSearchMC);
    dtdeliverydate.addEventListener("change", dtdeliverydateCH);
    secoundcustomorder.addEventListener("change",secoundcustomorderCH);
    cmbproduct.addEventListener("change",cmbproductCH);
    cmbfirstcustomorder.addEventListener("change",cmbfirstcustomorderCH);

    privilages = httpRequest("../privilage?module=DELIVERY", "GET");

    //data list for form combo
    deliverystatus = httpRequest("../deliverystatus/list", "GET");
    vehicle = httpRequest("../vehicle/list", "GET");
    employees = httpRequest("../employee/list", "GET");
    vehicletype = httpRequest("../vtype/list", "GET");
    vehiclestatus = httpRequest("../vstatus/list", "GET");

    //data list for inner combo
    corders = httpRequest("../customerorder/listbyCompletedandRequireDelivery", "GET");
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
    changeTab('form');
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
//
function loadTable(page, size, query) {
    page = page - 1;
    deliveries = new Array();
    var data = httpRequest("/delivery/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) deliveries = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblDelivery', deliveries, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblDelivery);

    if (activerowno != "") selectRow(tblDelivery, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (olddelivery == null) {
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

    deliveryview = JSON.parse(JSON.stringify(co));

    tblDelierycode.innerHTML =  deliveryview.deliverycode;
    tblDeliverydate.innerHTML =  deliveryview.deliverydate;
    tblAddeddate.innerHTML = deliveryview.addeddate;
    tblAddedby.innerHTML = deliveryview.added_employee_id.callingname;
    tblStatus.innerHTML = deliveryview.deliverystatus_id.name;
    tblDeliveryagent.innerHTML = deliveryview.deliveryagent_employee_id.callingname;
    tblDriver.innerHTML = deliveryview.driver_employee_id.callingname;
    tblVehicle.innerHTML = deliveryview.vehicle_id.vehiclename;

    if (deliveryview.description != null){
        tblDescription.innerHTML = deliveryview.description;
    }
    fillInnerTable("tblInnerViewDeliveryCorder", deliveryview.deliveryHasCorderList, fillInnerForm, btnInnerDeleteMC, viewInnerOrderProduct);
    $('#viewmodal').modal('show');

}

function btnInnerDeleteMC(){}

function btnPrintrow() {

    var format = printformtable.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'></head>" +
        "<body><div style='margin-top: 150px'><h1>Delivery Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);

}

function cmbvtypeCH(){

    listofvehicles = httpRequest("/vehicle/listofvehicles?vehicletypeid=" + JSON.parse(cmbvtype.value).id, "GET");
    fillCombo3(cmbvehicle, "Select Vehicle", listofvehicles, "vehiclename", "vehiclenumber");
    cmbvehicle.disabled = false;
    cmbvtype.style.border = valid;

    if(olddelivery != null){
        cmbvehicle.style.border = initial;
        cmbvehicle.disabled = false;
        listofvehicles = httpRequest("/vehicle/listofvehicles?vehicletypeid=" + JSON.parse(cmbvtype.value).id, "GET");
        fillCombo3(cmbvehicle, "Select Vehicle", listofvehicles, "vehiclename", "vehiclenumber");
        cmbvtype.style.border = updated;
    }
}

function loadForm() {
    delivery = new Object();
    olddelivery = null;

    //create array List
    delivery.deliveryHasCorderList = new Array();
    fillCombo(cmbdstatus, "Select Status", deliverystatus, "name", "In-Delivered");
    fillCombo(cmbvehicle, "Select Vehicle", vehicle, "vehiclename", "");
    fillCombo(cmbvtype, "Select Vehicle", vehicletype, "name", "");
    fillCombo(cmbdriveremployee, "Select Driver", employees, "callingname", "");
    fillCombo(cmbdeliveryagentemployee, "Select Delivery Agent", employees, "callingname", "");
    fillCombo(cmbaddedemployee, "Select Added Employee", employees, "callingname", "");
    fillCombo(cmbaddedemployee, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);

    delivery.added_employee_id = JSON.parse(cmbaddedemployee.value);
    delivery.deliverystatus_id = JSON.parse(cmbdstatus.value);
    cmbaddedemployee.disabled = true;

   //Added date Field
    dtadddeddate.value= getCurrentDateTime("date");
    delivery.addeddate = dtadddeddate.value;
    dtadddeddate.disabled = true;
    dtadddeddate.style.border = valid;

  // Get Next Number Form Data Base
    var nextNumber = httpRequest("/delivery/nextnumber", "GET");
    txtdeliverycode.value = nextNumber.deliverycode;
    delivery.deliverycode = txtdeliverycode.value;
    txtdeliverycode.disabled = "disabled";
    txtdeliverycode.style.border = valid;

   // Require Date
    dtdeliverydate.min = getCurrentDateTime("date");
    let today = new Date();
    let afteroneweek = new Date();
    afteroneweek.setDate(today.getDate()+7);
    let month = afteroneweek.getMonth()+1;
    if (month < 10) month = "0" +month;
    let day = afteroneweek.getDate();
    if (day < 10) day = "0"+day;
    dtdeliverydate.max = afteroneweek.getFullYear()+"-"+month+"-"+day;

    txtDescription.value = "";

    setStyle(initial);
    cmbaddedemployee.style.border = valid;
    dtadddeddate.style.border = valid;
    cmbdstatus.style.border = valid;

    cmbdstatus.disabled =true;
    cmbvehicle.disabled = true;
    cmbdriveremployee.disabled = true;
    cmbdeliveryagentemployee.disabled = true;

    disableButtons(false, true, true);
    firstrefreshInner();
    secondrefreshInner();
}
function cmbfirstcustomorderCH(){

    listofdeliverydetails = httpRequest("../customerorderhasproduct/listofcorderdeliverdetails?customerorderid="+JSON.parse(cmbfirstcustomorder.value).id, "GET");

    console.log(listofdeliverydetails)
    console.log(listofdeliverydetails[0].address)
    console.log(listofdeliverydetails[0].cpmobile)
    console.log(listofdeliverydetails[0].cpname)
    firstdeliveryHasCorder.address = listofdeliverydetails[0].address;
    firstdeliveryHasCorder.cpmobile = listofdeliverydetails[0].cpmobile;
    firstdeliveryHasCorder.cpname = listofdeliverydetails[0].cpname;
}
function secoundcustomorderCH(){

    listofcustomerorderproduct = httpRequest("../product/listbyproduct?corderid="+JSON.parse(secoundcustomorder.value).id, "GET");
    fillCombo(cmbproduct, "Select Product", listofcustomerorderproduct, "productname", "");


}
function cmbproductCH(){

    var listofdeliverycorderproduct = httpRequest("/customerorderhasproduct/listofcorderproductdeliverdetails?customerorderid=" + JSON.parse(secoundcustomorder.value).id + "&productid=" + JSON.parse(cmbproduct.value).id , "GET");

    cmbQuantity.value =listofdeliverycorderproduct[0].qty;
    cmbQuantity.style.border = valid;
    secounddeliveryHasCorder.qty = cmbQuantity.value;

    secounddeliveryHasCorder.address = listofdeliverycorderproduct[0].address;
    secounddeliveryHasCorder.cpmobile = listofdeliverycorderproduct[0].cpmobile;
    secounddeliveryHasCorder.cpname = listofdeliverycorderproduct[0].cpname;
}

function dtdeliverydateCH(){
    cmbdriveremployee.value ="";
    cmbdriveremployee.style.border = initial;
    delivery.driver_employee_id = null;
    driveremployees = httpRequest("../employee/listbyAddedDateofdelivery?addeddate="+dtdeliverydate.value, "GET");
    fillCombo(cmbdriveremployee, "Select Driver", driveremployees, "callingname", "");

    cmbdeliveryagentemployee.value ="";
    cmbdeliveryagentemployee.style.border = initial;
    delivery.deliveryagent_employee_id = null;
    agentemployees = httpRequest("../employee/listbyAddedDateofdeliveryAgents?addeddate="+dtdeliverydate.value, "GET");
    fillCombo(cmbdeliveryagentemployee, "Select Delivery Agent", agentemployees, "callingname", "");

    cmbvehicle.value ="";
    cmbvehicle.style.border = initial;
    delivery.vehicle_id = null;
    listofvehicles = httpRequest("../vehicle/listbyAddedDateofVehical?addeddate="+dtdeliverydate.value, "GET");
    fillCombo(cmbvehicle, "Select Vehicle", listofvehicles, "vehiclename", "");
    cmbdriveremployee.disabled = false;
    cmbdeliveryagentemployee.disabled = false;

}

function firstrefreshInner() {

    firstdeliveryHasCorder = new Object();
    firstolddeliveryHasCorder = null;

    cmbfirstcustomorder.style.border = initial;
    cmbfirstcustomorder.value="";
    fillCombo(cmbfirstcustomorder, "Select Customer Order", corders, "cordercode", "");

    fillInnerTable("firsttblInnerDeliveryCorder",  delivery.deliveryHasCorderList, false, firstbtnInnerDeleteMC, false)

}

function getFirstInnerErrors() {

    var innererrors = "";
    addInnervalue = "";


    if (firstdeliveryHasCorder.corder_id == null) {
        innererrors = innererrors + "\n" + "Customer Order Not Selected";
        cmbcustomorder.style.border = invalid;
    } else addInnervalue = 1;

    return innererrors;

}

function btnFirstInnerAddMc(){

    if (getFirstInnerErrors()==""){
        var matext = false;
        for (var index in delivery.deliveryHasCorderList) {
            if (delivery.deliveryHasCorderList[index].corder_id.cordercode == firstdeliveryHasCorder.corder_id.cordercode) {
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

            //bind the status into inner object
            firstdeliveryHasCorder.deliverystatus_id = deliverystatus[1];
            delivery.deliveryHasCorderList.push(firstdeliveryHasCorder);
            firstrefreshInner();
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

function firstbtnInnerDeleteMC(innerob, innerrow) {

    swal({
        title: "Are you sure to Delete following Customer Order Details...?",

        text: "\nCustomer Order :" + innerob.corder_id.cordercode,
        icon: "warning", buttons: true, dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                delivery.deliveryHasCorderList.splice(innerrow, 1)
                firstrefreshInner();
            }
        });

}


function secondrefreshInner() {

    secounddeliveryHasCorder = new Object();
    oldsecoundolddeliveryHasCorder = null;

    secoundcustomorder.style.border =initial;
    cmbproduct.style.border =initial;
    cmbQuantity.style.border =initial;

    secoundcustomorder.value = "";
    cmbproduct.value = "";
    cmbQuantity.value = "";

    fillCombo(secoundcustomorder, "Select Customer Order", corders, "cordercode", "");
    fillCombo(cmbproduct, "Select Product", products, "productname", "");

    fillInnerTable("secoundtblInnerDeliveryCorder",  delivery.deliveryHasCorderList, false, secoundbtnInnerDeleteMC, false);
}

function getsecoundInnerErrors() {

    var innererrors = "";
    addInnervalue = "";


    if (secounddeliveryHasCorder.corder_id == null) {
        innererrors = innererrors + "\n" + "Customer Order Not Selected";
        secoundcustomorder.style.border = invalid;
    } else addInnervalue = 1;

    if (secounddeliveryHasCorder.product_id == null) {
        innererrors = innererrors + "\n" + "Product Not Selected";
        cmbproduct.style.border = invalid;
    } else addInnervalue = 1;

    if (secounddeliveryHasCorder.qty == null) {
        innererrors = innererrors + "\n" + "Qty Not Enter";
        cmbQuantity.style.border = invalid;
    } else addInnervalue = 1;

    return innererrors;

}

function btnSecoundInnerMc(){

    if (getsecoundInnerErrors()==""){
        var matext = false;
        for (var index in delivery.deliveryHasCorderList) {
            if (delivery.deliveryHasCorderList[index].product_id.productname == secounddeliveryHasCorder.product_id.productname) {
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

            //bind the status into inner object
            secounddeliveryHasCorder.deliverystatus_id = deliverystatus[1];
            delivery.deliveryHasCorderList.push(secounddeliveryHasCorder);
            secondrefreshInner();
        }
    }else {
        swal({
            title: "You have following errors",
            text: "\n"+getsecoundInnerErrors(),
            icon: "error",
            button: true,
        });
    }

}

function secoundbtnInnerDeleteMC(innerob, innerrow) {

    swal({
        title: "Are you sure to Delete following Customer Order Details...?",

        text: "\nCustomer Order :" + innerob.corder_id.cordercode,
        icon: "warning", buttons: true, dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                delivery.deliveryHasCorderList.splice(innerrow, 1)
                secondrefreshInner();
            }
        });

}


function fillInnerForm() {
}

function viewInnerOrderProduct(){

}

function setStyle(style) {

    dtadddeddate.style.border = style;
    cmbvtype.style.border = style;
    dtdeliverydate.style.border = style;
    cmbdstatus.style.border = style;
    txtDescription.style.border = style;
    cmbdriveremployee.style.border = style;
    cmbdeliveryagentemployee.style.border = style;
    cmbaddedemployee.style.border = style;
    cmbvehicle.style.border = style;


}

function disableButtons(add, upd, del) {

    //loadform --> add=false,update=true,del=false
    //fillform --> add=true,update=true,del=false
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

    //class element --> buttonup
    //class element --> buttondel
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
    for (index in deliveries) {
        if (deliveries[index].deliverystatus_id.name == "Deleted") {
            tblDelivery.children[1].children[index].style.color = "#f00";
            tblDelivery.children[1].children[index].style.border = "2px solid red";
            tblDelivery.children[1].children[index].lastChild.children[1].disabled = true;
            tblDelivery.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}


function getErrors() {

    var errors = "";
    addvalue = "";

    if (delivery.deliverycode == null) {
        errors = errors + "\n" + "Delivery Code Not Enter";
        txtdeliverycode.style.border = invalid;
    } else addvalue = 1;

    if (delivery.deliverydate == null) {
        errors = errors + "\n" + "Delivery Date Not Selected";
        dtdeliverydate.style.border = invalid;
    } else addvalue = 1;

    if (delivery.addeddate == null) {
        errors = errors + "\n" + "Added Not Selected";
        dtadddeddate.style.border = invalid;
    } else addvalue = 1;

    if (delivery.deliverystatus_id == null) {
        errors = errors + "\n" + "Status Not Selected";
        cmbdstatus.style.border = invalid;
    } else addvalue = 1;

    if (delivery.driver_employee_id == null) {
        errors = errors + "\n" + "Driver Not Selected";
        cmbdriveremployee.style.border = invalid;
    } else addvalue = 1;

    if (delivery.deliveryagent_employee_id == null) {
        errors = errors + "\n" + "Delivery Agent Not Selected";
        cmbdeliveryagentemployee.style.border = invalid;
    } else addvalue = 1;

    if (delivery.added_employee_id == null) {
        errors = errors + "\n" + "Added By Not Selected";
        cmbaddedemployee.style.border = invalid;
    } else addvalue = 1;

    if (delivery.vehicle_id == null) {
        errors = errors + "\n" + "Vehicle Not Selected";
        cmbvehicle.style.border = invalid;
    } else addvalue = 1;

    if (delivery.deliveryHasCorderList.length == 0) {
        errors = errors + "\n" + "Customer Order Not Selected";
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
        text: "\nDelivery Code : " + delivery.deliverycode +
            "\nDelivery Date : " + delivery.deliverydate +
            "\nAdded Date : " + delivery.addeddate +
            "\nDelivery Status : " + delivery.deliverystatus_id.name +
            "\nDriver : " + delivery.driver_employee_id.callingname +
            "\nDelivery Agent : " + delivery.deliveryagent_employee_id.callingname +
            "\nAdded By : " + delivery.added_employee_id.callingname +
            "\nDVehicle Number: " + delivery.vehicle_id.vehiclenumber +
            "\nVehicle name : " + delivery.vehicle_id.vehiclename,


        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/delivery", "POST", delivery);
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

function fillForm(deli, rowno) {
    activerowno = rowno;

    if (olddelivery == null) {
        filldata(deli);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(deli);
            }

        });
    }

}

function getdeliverytype(ob){
    var producttype = false;
    for (var index in ob.deliveryHasCorderList){
        if (ob.deliveryHasCorderList[index].product_id != null){
            producttype = true;
            break;
        }
    }
}
function filldata(deli) {
    clearSelection(tblDelivery);
    selectRow(tblDelivery, activerowno, active);

    delivery = JSON.parse(JSON.stringify(deli));
    olddelivery = JSON.parse(JSON.stringify(deli));

    txtdeliverycode.value = delivery.deliverycode;
    dtdeliverydate.value = delivery.deliverydate;
    dtadddeddate.value = delivery.addeddate;

    fillCombo(cmbdstatus, "Select Status", deliverystatus, "name", delivery.deliverystatus_id.name);
    fillCombo(cmbdriveremployee, "Select Added by", employees, "callingname", delivery.driver_employee_id.callingname);
    fillCombo(cmbdeliveryagentemployee, "Select Delivery Agent", employees, "callingname", delivery.deliveryagent_employee_id.callingname);
    fillCombo(cmbaddedemployee, "Select Added By", employees, "callingname", delivery.added_employee_id.callingname);

    fillCombo(cmbvtype, "Select Vehicle type", vehicletype, "name", delivery.vehicle_id.vtype_id.name);
    fillCombo(cmbvehicle, "Select Vehicle", vehicle, "vehiclename", delivery.vehicle_id.vehiclename);
    cmbdstatus.disabled = false;

    disableButtons(true, false, false);
    setStyle(valid);

    txtDescription.style.border = initial;
    //check null statements
    if (delivery.txtDescription != null){
        txtDescription.style.border = valid;
        txtDescription.value = delivery.description;
    }

    if (getdeliverytype(delivery)){
        changefirstTab('tab1');
        secondrefreshInner();
    }else {
        changefirstTab('tab2');
        firstrefreshInner();
    }

    $('#formmodel').modal('show')

}

function getUpdates() {

    var updates = "";

    if (delivery != null && olddelivery != null) {

        if (delivery.deliverycode != olddelivery.deliverycode)
            updates = updates + "\n Delivery Code is Changed.." + olddelivery.deliverycode + " into " + delivery.deliverycode;

        if (delivery.deliverydate != olddelivery.deliverydate)
            updates = updates + "\nDelivery Date is Changed.." + olddelivery.deliverydate + " into " + delivery.deliverydate

        if (delivery.addeddate != olddelivery.addeddate)
            updates = updates + "\nAdded Date is Changed.." + olddelivery.addeddate + " into " + delivery.addeddate;

        if (delivery.deliverystatus_id.name != olddelivery.deliverystatus_id.name)
            updates = updates + "\nStatus is Changed.." + olddelivery.deliverystatus_id.name + " into " + delivery.deliverystatus_id.name;

        if (delivery.driver_employee_id.callingname != olddelivery.driver_employee_id.callingname)
            updates = updates + "\nDriver is Changed.." + olddelivery.driver_employee_id.callingname + " into " + delivery.driver_employee_id.callingname;

        if (delivery.description != olddelivery.description)
            updates = updates + "\nDescription is Changed..";

        if (delivery.deliveryagent_employee_id.callingname != olddelivery.deliveryagent_employee_id.callingname)
            updates = updates + "\nDelivery Agent is changed.." + olddelivery.deliveryagent_employee_id.callingname + " into " + delivery.deliveryagent_employee_id.callingname;

        if (delivery.added_employee_id.callingname != olddelivery.added_employee_id.callingname)
            updates = updates + "\nAdded Employee is Changed.." + olddelivery.added_employee_id.callingname + " into " + delivery.added_employee_id.callingname;

        if (delivery.vehicle_id.vehiclename != olddelivery.vehicle_id.vehiclename)
            updates = updates + "\nVehicle is Changed.." + olddelivery.vehicle_id.vehiclename + " into " + delivery.vehicle_id.vehiclename;

        if (isEqualtolist(delivery.deliveryHasCorderList, olddelivery.deliveryHasCorderList , 'cordercode'))
            updates = updates + "\nCustomer Order is Changed..";

        if (isEqualtolist(delivery.deliveryHasCorderList, olddelivery.deliveryHasCorderList , 'productname'))
            updates = updates + "\nProduct is Changed..";

        if (isEqualtolist(delivery.deliveryHasCorderList, olddelivery.deliveryHasCorderList , 'name'))
            updates = updates + "\nDelivery Status is Changed..";

        if (isEqualtolist(delivery.deliveryHasCorderList, olddelivery.deliveryHasCorderList , 'cpname'))
            updates = updates + "\nContact Name is Changed..";

        if (isEqualtolist(delivery.deliveryHasCorderList, olddelivery.deliveryHasCorderList , 'cpmobile'))
            updates = updates + "\nContact Mobile is Changed..";

        if (isEqualtolist(delivery.deliveryHasCorderList, olddelivery.deliveryHasCorderList , 'address'))
            updates = updates + "\nAddress is Changed..";

        if (isEqualtolist(delivery.deliveryHasCorderList, olddelivery.deliveryHasCorderList , 'deliverystatus_id'))
            updates = updates + "\nStatus is Changed..";

        if (isEqualtolist(delivery.deliveryHasCorderList, olddelivery.deliveryHasCorderList , 'qty'))
            updates = updates + "\nQuantity is Changed..";

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
                title: "Are you sure to update following Delivery details...?",
                text: "\n"+ getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/delivery", "PUT", delivery);
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

function btnDeleteMC(deli) {
    delivery = JSON.parse(JSON.stringify(deli));

    swal({
        title: "Are you sure to delete following Delivery...?",
        text: "\n Delivery Number : " + delivery.deliverycode +
            "\n Delivery Date  : " + delivery.deliverydate,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/delivery", "DELETE", delivery);
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

/*inner tab change and confirmation from user*/
function changefirstTab(viewfirstname) {
    if(viewfirstname=='tab1'){

        if (delivery.deliveryHasCorderList != 0){
            swal({
                title: "Are you sure to change...?",
                text: "Table have some Data.....",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    delivery.deliveryHasCorderList = new Array();
                    fillInnerTable("secoundtblInnerDeliveryCorder",  delivery.deliveryHasCorderList, false, secoundbtnInnerDeleteMC, false)

                    tbForm.classList.add('active');
                    tbTable.classList.remove('active');
                    divFrom.style.display = "block";
                    divTable.style.display = "none";
                    cmbfirstcustomorder.required;
                }
            });
        }else {
            delivery.deliveryHasCorderList = new Array();
            fillInnerTable("secoundtblInnerDeliveryCorder",  delivery.deliveryHasCorderList, false, secoundbtnInnerDeleteMC, false)

            tbForm.classList.add('active');
            tbTable.classList.remove('active');
            divFrom.style.display = "block";
            divTable.style.display = "none";
            cmbfirstcustomorder.required;
        }
    }
    if(viewfirstname=='tab2'){

        if (delivery.deliveryHasCorderList != 0){
            swal({
                title: "Are you sure to change...?",
                text: "Table have some Data.....",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    delivery.deliveryHasCorderList = new Array();
                    fillInnerTable("firsttblInnerDeliveryCorder",  delivery.deliveryHasCorderList, fillInnerForm, secoundbtnInnerDeleteMC, false)

                    tbForm.classList.remove('active');
                    tbTable.classList.add('active');
                    divFrom.style.display = "none";
                    divTable.style.display = "block";

                    secoundcustomorder.required;
                    cmbproduct.required;
                    cmbQuantity.required;
                }
            });
        }else {
            delivery.deliveryHasCorderList = new Array();
            fillInnerTable("firsttblInnerDeliveryCorder",  delivery.deliveryHasCorderList, fillInnerForm, secoundbtnInnerDeleteMC, false)

            tbForm.classList.remove('active');
            tbTable.classList.add('active');
            divFrom.style.display = "none";
            divTable.style.display = "block";

            secoundcustomorder.required;
            cmbproduct.required;
            cmbQuantity.required;
        }

    }

}