window.addEventListener("load", initialize);

//Initializing Functions

function initialize() {
    $('[data-toggle="tooltip"]').tooltip()

    $('.collapse').collapse("hide")
    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    txtSearchName.addEventListener("keyup", btnSearchMC);
    $('.js-example-basic-single').select2();

    cmbCustomer.addEventListener("change", btnCustomertype);

    privilages = httpRequest("../privilage?module=CUSTOMER", "GET");

    customertypes = httpRequest("../customertype/list", "GET");
    cities = httpRequest("../city/list", "GET");
    customerstatus = httpRequest("../customerstatus/list", "GET");
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
    customers = new Array();
    var data = httpRequest("/customer/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) customers = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblCustomer', customers, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblCustomer);

    if (activerowno != "") selectRow(tblCustomer, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldcustomer == null) {
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

function viewitem(cus, rowno) {

    customer = JSON.parse(JSON.stringify(cus));

    if(customer.customertype_id.name ==  "Whole"){
       //
       //
        tblWcnumber.innerHTML = customer.regno;
        tblWctype.innerHTML = customer.customertype_id.name;

        tblcwname.innerHTML = customer.companyname;
        tblcewaddress.innerHTML = customer.cemail;
        tblcwlannumber.innerHTML = customer.cland;
        tblcwfax.innerHTML = customer.cfax;
        tblcpwmobile.innerHTML = customer.cpmobile;
        tblcpwname.innerHTML = customer.cpname;

         tblWaddress.innerHTML = customer.address;
         tblWdescription.innerHTML = customer.description;
         tblWcity.innerHTML = customer.cities_id.name;
         tblWadddate.innerHTML = customer.addeddate;
         tblWcstatus.innerHTML = customer.customerstatus_id.name;
         tblWemployee.innerHTML = customer.employee_id.callingname;

        $('#wholeDataviewModal').modal('show')


    }else {
        //
        //
        tblRcnumber.innerHTML = customer.regno;
        tblRctype.innerHTML = customer.customertype_id.name;


        tblfname.innerHTML = customer.fname;
        tbllname.innerHTML = customer.lname;
        tblcustomermobile.innerHTML = customer.mobile;
        tblnic.innerHTML = customer.nic;
        tblcustomeremail.innerHTML = customer.email;
        tbllnumber.innerHTML = customer.land;


        tblRaddress.innerHTML = customer.address;
        tblRdescription.innerHTML = customer.description;
        tblRcity.innerHTML = customer.cities_id.name;
        tblRadddate.innerHTML = customer.addeddate;
        tblRcstatus.innerHTML = customer.customerstatus_id.name;
        tblRemployee.innerHTML = customer.employee_id.callingname;

        $('#rentalDataviewModal').modal('show')

    }
}

function btnprintrowMC(){

    var Wformat ="";
    var Rformat ="";
    if(customer.customertype_id.name ==  "Whole"){
        var Wformat = printformWtable.outerHTML;


        var newwindow = window.open();
        newwindow.document.write("<html>" +
            "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
            "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'></head>" +
            "<body><div style='margin-top: 150px'><h1>Whole Customer Details :</h1></div>" +
            "<div>" + Wformat + "</div>" +
            "<script>printformtable.removeAttribute('style')</script>" +
            "</body></html>");
        setTimeout(function () {
            newwindow.print();
            newwindow.close();
        }, 100);

    }else {
        var Rformat =  printformRtable.outerHTML;

        var newwindow = window.open();
        newwindow.document.write("<html>" +
            "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
            "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'></head>" +
            "<body><div style='margin-top: 150px'><h1> Rental Customer Details :</h1></div>" +
            "<div>" + Rformat + "</div>" +
            "<script>printformtable.removeAttribute('style')</script>" +
            "</body></html>");
        setTimeout(function () {
            newwindow.print();
            newwindow.close();
        }, 100);

    }


}

function btnCustomertype(){
    if (customer.customertype_id.name == "Whole"){

        if (customer.fname != null ||  customer.lname != null || customer.mobile != null || customer.nic != null || customer.email != null || customer.land != null){
            swal({
                title: "Are you sure to change the whole customer type...?",
                text: "Form has some filled data.....",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    wholesalecustomer.style.display="block";
                    Individualcustomer.style.display="none";
                    $('#collapseOne').collapse('show')
                    $('#collapseTwo').collapse('hide')
                    clearrental();
                }
            });
        }else {
            wholesalecustomer.style.display="block";
            Individualcustomer.style.display="none";
            $('#collapseOne').collapse('show')
            $('#collapseTwo').collapse('hide')
            clearrental(); }

    }else {

        if (customer.companyname != null ||  customer.cemail != null || customer.cland != null || customer.cfax != null || customer.cpname != null || customer.cpmobile != null){
            swal({
                title: "Are you sure to change the rental customer type...?",
                text: "Form has some filled data.....",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    Individualcustomer.style.display="block";
                    wholesalecustomer.style.display="none";
                    $('#collapseTwo').collapse('show')
                    $('#collapseOne').collapse('hide')
                    clearwhole();
                }
            });
        }else {
            Individualcustomer.style.display="block";
            wholesalecustomer.style.display="none";
            $('#collapseTwo').collapse('show')
            $('#collapseOne').collapse('hide')
            clearwhole(); }


    }
}

function clearrental(){

    customer.fname = null;
    customer.lname = null;
    customer.mobile = null;
    customer.nic = null;
    customer.email = null;
    customer.land = null;

    txtfname.value = "";
    txtLname.value = "";
    txtCmobile.value = "";
    txtNic.value = "";
    textEmail.value = "";
    txtLnumber.value = "";

    txtfname.style.border = initial;
    txtLname.style.border = initial;
    txtCmobile.style.border = initial;
    txtNic.style.border = initial;
    textEmail.style.border = initial;
    txtLnumber.style.border = initial;

}

function clearwhole(){

    customer.companyname = null;
    customer.cemail = null;
    customer.cland = null;
    customer.cfax = null;
    customer.cpname = null;
    customer.cpmobile = null;

    txtCompanyname.value = "";
    txtCpemail.value = "";
    txtCLnumber.value = "";
    txtCFnumber.value = "";
    txtCpnumber.value = "";
    txtCpname.value = "";

    txtCompanyname.style.border = initial;
    txtCpemail.style.border = initial;
    txtCLnumber.style.border = initial;
    txtCFnumber.style.border = initial;
    txtCpnumber.style.border = initial;
    txtCpname.style.border = initial;

}

function loadForm() {
    customer = new Object();
    oldcustomer = null;

    //fillcombo (feild id , message, objectlist, propertiess, value);

    fillCombo(cmbCustomer, "Select Customer", customertypes, "name", "");
    fillCombo(cmbCity, "Select City", cities, "name", "");

    fillCombo(cmbStatus, "", customerstatus, "name", "pending");
    customer.customerstatus_id = JSON.parse(cmbStatus.value);
    cmbStatus.disabled = true;

    fillCombo(cmbEmployee, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    customer.employee_id = JSON.parse(cmbEmployee.value);
    cmbEmployee.disabled = true;


    var today = new Date();
    var month = today.getMonth() + 1;
    if (month < 10) month = "0" + month;
    var date = today.getDate();
    if (date < 10) date = "0" + date;

    txtAdddate.value = today.getFullYear() + "-" + month + "-" + date;
    customer.addeddate = txtAdddate.value;
    txtAdddate.disabled = true;

       // Get Next Number Form Data Base
         var nextNumber = httpRequest("/customer/nextnumber", "GET");
         txtOrdernum.value = nextNumber.regno;
         customer.regno = txtOrdernum.value;
         txtOrdernum.disabled="disabled";
         txtOrdernum.style.border = valid;

    cmbCustomer.value = "";
    txtCompanyname.value = "";
    txtCpemail.value = "";
    txtCLnumber.value = "";
    txtCFnumber.value = "";
    txtCpnumber.value = "";
    txtCpname.value = "";


    txtfname.value = "";
    txtLname.value = "";
    txtCmobile.value = "";
    txtNic.value = "";
    textEmail.value = "";
    txtLnumber.value = "";

    cmbCity.value = "";
    txtDescription.value = "";

    setStyle(initial);
    cmbEmployee.style.border = valid;
    txtAdddate.style.border = valid;
    cmbStatus.style.border = valid;

    disableButtons(false, true, true);
}

function setStyle(style) {


    cmbCustomer.style.border = style;
    txtCompanyname.style.border = style;
    txtCpemail.style.border = style;
    txtCLnumber.style.border = style;
    txtCFnumber.style.border = style;
    txtCpname.style.border = style;
    txtCpnumber.style.border = style;
    txtfname.style.border = style;
    txtLname.style.border = style;
    txtCmobile.style.border = style;
    txtNic.style.border = style;
    textEmail.style.border = style;
    txtLnumber.style.border = style;

    txtAddress.style.border = style;
    $("#cityselect2parent .select2-container").css('border',style);
    txtDescription.style.border = style;
    cmbEmployee.style.border = style;
    txtAdddate.style.border = style;
    cmbStatus.style.border = style;

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
    for (index in customers) {
        if (customers[index].customerstatus_id.name == "Deleted") {
            tblCustomer.children[1].children[index].style.color = "#f00";
            tblCustomer.children[1].children[index].style.border = "2px solid red";
            tblCustomer.children[1].children[index].lastChild.children[1].disabled = true;
            tblCustomer.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (customer.regno == null) {
        txtOrdernum.style.border = invalid;
        errors = errors + "\n" + "Customer Reg Not Enter";
    } else addvalue = 1;

    if (customer.customertype_id == null) {
        cmbCustomer.style.border = invalid;
        errors = errors + "\n" + "Customer Type Not Selected";
    } else {

        if (customer.customertype_id.name == "Whole") {

            if (customer.companyname == null) {
                txtCompanyname.style.border = invalid;
                errors = errors + "\n" + "Company name Not Enter";
            } else addvalue = 1;

            if (customer.cemail == null) {
                txtCpemail.style.border = invalid;
                errors = errors + "\n" + "Email Not Enter";
            } else addvalue = 1;

            if (customer.cland == null) {
                txtCLnumber.style.border = invalid;
                errors = errors + "\n" + "Company Land Number Not Enter";
            } else addvalue = 1;


            if (customer.cpmobile == null) {
                txtCpnumber.style.border = invalid;
                errors = errors + "\n" + "Contact Person Number Not Enter";
            } else addvalue = 1;

            if (customer.cpname == null) {
                txtCpname.style.border = invalid;
                errors = errors + "\n" + "Contact Person Name Not Enter";
            } else addvalue = 1;

        } else {
            if (customer.fname == null) {
                txtfname.style.border = invalid;
                errors = errors + "\n" + "First Name Not Enter";
            } else addvalue = 1;

            if (customer.lname == null) {
                txtLname.style.border = invalid;
                errors = errors + "\n" + "Last Name Not Enter";
            } else addvalue = 1;


            if (customer.nic == null) {
                txtNic.style.border = invalid;
                errors = errors + "\n" + "NIC Not Enter";
            } else addvalue = 1;


            if (customer.mobile == null) {
                txtCmobile.style.border = invalid;
                errors = errors + "\n" + "Mobile Not Enter";
            } else addvalue = 1;

            if (customer.email == null) {
                textEmail.style.border = invalid;
                errors = errors + "\n" + "Email Not Enter";
            } else addvalue = 1;


        }


    }

    if (customer.address == null) {
        txtAddress.style.border = invalid;
        errors = errors + "\n" + "Address Not Enter";
    } else addvalue = 1;


    if (customer.cities_id == null) {
        $("#cityselect2parent .select2-container").css('border',invalid);
        errors = errors + "\n" + "city Not Selected";
    } else addvalue = 1;


    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (txtDescription.value == "" || txtLnumber.value == "" || txtCFnumber.value == "") {
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

    if(customer.customertype_id.name == "Whole"){

        swal({

            title: "Are you sure to add following Customer...?",
            text: "\n Registration No : " + customer.regno +
                "\n Company Name : " + customer.companyname +
                "\n Company Email Address : " + customer.cemail +
                "\n Company Land Number : " + customer.cland +
                "\n Contact Person Mobile : " + customer.cpmobile +
            "\n Contact Person Name : " + customer.cpname,


            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                var response = httpRequest("/customer", "POST", customer);
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
                    changeTab('table');
                } else swal({
                    title: 'Save not Success... , You have following errors', icon: "error",
                    text: '\n ' + response,
                    button: true
                });
            }
        });

    }else {
        swal({

            title: "Are you sure to add following Customer...?",
            text:   "\n Registration No : " + customer.regno +
                    "\n First Name : " + customer.fname +
                    "\n Last Name : " + customer.customerstatus_id.name +
                    "\n Mobile Number : " + customer.mobile +
                    "\n NIC Number : " + customer.nic +
                    "\n Email Address : " + customer.address,


            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                var response = httpRequest("/customer", "POST", customer);
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
                    changeTab('table');
                } else swal({
                    title: 'Save not Success... , You have following errors', icon: "error",
                    text: '\n ' + response,
                    button: true
                });
            }
        });
    }


}

function btnClearMC() {
    //Get Cofirmation from the User window.confirm();
    checkerr = getErrors();

    if (oldcustomer == null && addvalue == "") {
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

    if (oldcustomer == null) {
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
    clearSelection(tblCustomer);
    selectRow(tblCustomer, activerowno, active);

    customer = JSON.parse(JSON.stringify(cus));
    oldcustomer = JSON.parse(JSON.stringify(cus));

    txtOrdernum.value = customer.regno;
    txtCompanyname.value = customer.companyname;
    txtCpemail.value = customer.cemail;
    txtCLnumber.value = customer.cland;
    txtCFnumber.value = customer.cfax;
    txtCpnumber.value = customer.cpmobile;
    txtCpname.value = customer.cpname;

    txtfname.value = customer.fname;
    txtLname.value = customer.lname;
    txtCmobile.value = customer.mobile;
    txtNic.value = customer.nic;
    textEmail.value = customer.email;
    txtLnumber.value = customer.land;
    txtAddress.value = customer.address;

    txtDescription.value = customer.description;
    txtAdddate.value = customer.addeddate;


    fillCombo(cmbCity, "Select City", cities, "name", customer.cities_id.name);
    fillCombo(cmbStatus, "Customer Status", customerstatus, "name", customer.customerstatus_id.name);
    cmbStatus.disabled = false;

    fillCombo(cmbEmployee, "", employees, "callingname", customer.employee_id.callingname);
    fillCombo(cmbCustomer, "Customer Type", customertypes, "name", customer.customertype_id.name);

    /*setDefaultFile('flePhoto', employee.photo);*/

    disableButtons(true, false, false);
    setStyle(valid);
    changeTab('form');


    if(customer.description == null){
        txtDescription.style.border=initial;
    }

    if(customer.cfax == null){
        txtCFnumber.style.border=initial;
    }

    if(customer.land == null){
        txtLnumber.style.border=initial;
    }
    if(customer.customertype_id.name == "Whole"){

        txtfname.style.border=initial;
        txtLname.style.border=initial;
        txtCmobile.style.border=initial;

        txtNic.style.border=initial;
        textEmail.style.border=initial;
        txtLnumber.style.border=initial;

        wholesalecustomer.style.display="block";
        Individualcustomer.style.display="none";
        $('#collapseOne').collapse('show')
        $('#collapseTwo').collapse('hide')


    }
    if(customer.customertype_id.name == "Rental"){

        txtCompanyname.style.border=initial;
        txtCpemail.style.border=initial;
        txtCLnumber.style.border=initial;

        txtCFnumber.style.border=initial;
        txtCpnumber.style.border=initial;
        txtCpname.style.border=initial;


        Individualcustomer.style.display="block";
        wholesalecustomer.style.display="none";
        $('#collapseTwo').collapse('show')
        $('#collapseOne').collapse('hide')
    }
}

function getUpdates() {

    var updates = "";

    if (customer != null && oldcustomer != null) {

        if (customer.regno != oldcustomer.regno)
            updates = updates + "\nCustomer Register Number is Changed.." + oldcustomer.regno + " into " + customer.regno;

        if (customer.customertype_id.name != oldcustomer.customertype_id.name)
            updates = updates + "\nCustomer Type is Changed.." + oldcustomer.customertype_id.name + " into " + customer.customertype_id.name;

        if (customer.companyname != oldcustomer.companyname)
            updates = updates + "\nCompany Name is Changed.." + oldcustomer.companyname + " into " + customer.companyname;

        if (customer.cemail != oldcustomer.cemail)
            updates = updates + "\nCompany Email is Changed.." + oldcustomer.cemail + " into " + customer.cemail;

        if (customer.cland != oldcustomer.cland)
            updates = updates + "\nCompany Land is Changed.." + oldcustomer.cland + " into " + customer.cland;

        if (customer.cfax != oldcustomer.cfax)
            updates = updates + "\nCompany fax is Changed.." + oldcustomer.cfax + " into " + customer.cfax;

        if (customer.cpmobile != oldcustomer.cpmobile)
            updates = updates + "\nContact Person Mobile is Changed.." + oldcustomer.cpmobile + " into " + customer.cpmobile;

        if (customer.cpname != oldcustomer.cpname)
            updates = updates + "\nContact Person Name is Changed.." + oldcustomer.cpname + " into " + customer.cpname;

        if (customer.fname != oldcustomer.fname)
            updates = updates + "\nFirst Name is Changed.." + oldcustomer.fname + " into " + customer.fname;

        if (customer.lname != oldcustomer.lname)
            updates = updates + "\nLan Number is Changed.." + oldcustomer.lname + " into " + customer.lname;

        if (customer.mobile != oldcustomer.mobile)
            updates = updates + "\nMobile Number is Changed.." + oldcustomer.mobile + " into " + customer.mobile;

        if (customer.nic != oldcustomer.nic)
            updates = updates + "\nNIC Number is Changed.." + oldcustomer.nic + " into " + customer.nic;

        if (customer.email != oldcustomer.email)
            updates = updates + "\nCustomer Email is Changed.." + oldcustomer.email + " into " + customer.email;

        if (customer.land != oldcustomer.land)
            updates = updates + "\nLan Number is Changed.." + oldcustomer.land + " into " + customer.land;

        if (customer.address != oldcustomer.address)
            updates = updates + "\nAddress is Changed.." + oldcustomer.address + " into " + customer.address;

        if (customer.description != oldcustomer.description)
            updates = updates + "\nDescription is Changed.." + oldcustomer.description + " into " + customer.description;

        if (customer.cities_id.name != oldcustomer.cities_id.name)
            updates = updates + "\nCity is Changed.." + oldcustomer.cities_id.name + " into " + customer.cities_id.name;

        if (customer.addeddate != oldcustomer.addeddate)
            updates = updates + "\nDate of Assignment is Changed.." + oldcustomer.addeddate + " into " + customer.addeddate;


        if (customer.customerstatus_id.name != oldcustomer.customerstatus_id.name)
            updates = updates + "\nCustomer Status is Changed.." + oldcustomer.customerstatus_id.name + " into " + customer.customerstatus_id.name;

        if (customer.employee_id.callingname != oldcustomer.employee_id.callingname)
            updates = updates + "\nEmployee Type is Changed.." + oldcustomer.employee_id.callingname + " into " + customer.employee_id.callingname;
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
                title: "Are you sure to update following empolyee details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/customer", "PUT", customer);
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
                            changeTab('table');

                        } else swal({
                            title: ' Failed To Add', icon: "error",
                            text: '\nYou have following errors ' + response,
                            button: true
                        });
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

function btnDeleteMC(cus) {
    customer = JSON.parse(JSON.stringify(cus));

    swal({
        title: "Are you sure to delete following customer...?",
        text: "\n Reg Number : " + customer.regno +
            "\n Customer First Name : " + customer.fname,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/customer", "DELETE", customer);
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

}

function btnSearchMC() {
    activepage = 1;
    loadSearchedTable();
}

function btnSearchClearMC() {
    loadView();
}

function btnPrintTableMC(customer) {

    var newwindow = window.open();
    formattab = tblCustomer.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Customer Details : </h1></div>" +
        "<div>" + formattab + "</div>" +
        "</body>" +
        "</html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}
