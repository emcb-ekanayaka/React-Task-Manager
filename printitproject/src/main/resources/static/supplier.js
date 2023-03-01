window.addEventListener("load", initialize);

//Initializing Functions

function initialize() {
    $('[data-toggle="tooltip"]').tooltip()

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    $('.js-example-basic-single').select2();
    txtSearchName.addEventListener("keyup", btnSearchMC);
    txtEmail.addEventListener("keyup", txtEmailKU);
    txtLandNumber.addEventListener("keyup", txtLandNumberKU);

    privilages = httpRequest("../privilage?module=SUPPLIER", "GET");

    //data list for form combo
    employees = httpRequest("../employee/list", "GET");
    supplierstatus = httpRequest("../supplierstatus/list", "GET");

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
    suppliers = new Array();
    var data = httpRequest("/supplier/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) suppliers = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblSupplier', suppliers, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblSupplier);

    if (activerowno != "") selectRow(tblSupplier, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldsupplier == null) {
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
        disableButtons(false, true, true);
    }

}

function viewitem(sup, rowno) {

    supplierview = JSON.parse(JSON.stringify(sup));

    SupplierNumber.innerHTML =  supplierview.suppliercode;
    CompanyName.innerHTML =  supplierview.companyname;
    Email.innerHTML =  supplierview.email;
    ContactPersonName.innerHTML =  supplierview.cpname;
    ContactPersonMobile.innerHTML = supplierview.cpmobile;
    LandNumber.innerHTML = supplierview.landno;
    BankName.innerHTML = supplierview.bankname;
    BankBranchName.innerHTML = supplierview.bankbranchname;
    BankAccountName.innerHTML = supplierview.bankaccname;
    BankAccountNumber.innerHTML = supplierview.bankacco;
    AddedDate.innerHTML = supplierview.addeddate;
    Address.innerHTML = supplierview.address;
    Description.innerHTML = supplierview.description;
    SupplierStatus.innerHTML = supplierview.supplierstatus_id.name;
    Employee.innerHTML = supplierview.employee_id.callingname;
    tblCreditLimit.innerHTML = parseFloat(supplierview.creditlimit).toFixed(2);
    tblArrestAmount.innerHTML = parseFloat(supplierview.arrestamount).toFixed(2);


    fillInnerTable("tblPrintInnerMaterial", supplierview.supplierHasMaterials, fillInnerForm, btnInnerDeleteMC, viewInnerMaterial)
    $('#suppliermodal').modal('show')

}

function btnPrintrow() {

    var format = printformtable.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'></head>" +
        "<body><div style='margin-top: 150px'><h1>Supplier Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);

}

function loadForm() {
    supplier = new Object();
    oldsupplier = null;

    //create array List

    supplier.supplierHasMaterials = new Array();

    fillCombo(cmbSupplierStatus, "Select Supplier Status", supplierstatus, "name", "In-Active");
    supplier.supplierstatus_id = JSON.parse(cmbSupplierStatus.value);
    cmbSupplierStatus.disabled = true;

    fillCombo(cmbEmployee, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    supplier.employee_id = JSON.parse(cmbEmployee.value);
    cmbEmployee.disabled = true;

    //Added date Field
    txtAddedDate.value= getCurrentDateTime("date");
    supplier.addeddate = txtAddedDate.value;
    txtAddedDate.disabled = true;
    txtAddedDate.style.border = valid;

    // Get Next Number Form Data Base
    var nextNumber = httpRequest("/supplier/nextnumber", "GET");
    txtSnumber.value = nextNumber.suppliercode;
    supplier.suppliercode = txtSnumber.value;
    txtSnumber.disabled = "disabled";
    txtSnumber.style.border = valid;


    txtCompanyName.value = "";
    txtEmail.value = "";
    txtContactPersonName.value = "";
    txxContactPersonMobile.value = "";
    txtLandNumber.value = "";
    txtBankName.value = "";
    txtBankBranchName.value = "";
    txtBankAccountName.value = "";
    txtBankAccountNumber.value = "";
    txtCredit.value = "";

    txtAddress.value = "";
    txtDescription.value = "";

    setStyle(initial);
    cmbSupplierStatus.style.border = valid;
    cmbEmployee.style.border = valid;
    txtAddedDate.style.border = valid;

    disableButtons(false, true, true);
    refreshInnerForm();
}

function txtEmailKU(){
    var val = txtEmail.value.trim();
    if (val != "") {
        var regpattern = new RegExp('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$');
        if (regpattern.test(val)) {
            var response = httpRequest("supplier/byemail?email=" + val, "GET")
            if (response == "") {
                supplier.email = val;
                if (oldsupplier != null && supplier.email != oldsupplier.email) {
                    txtEmail.style.border = updated;
                } else {
                    txtEmail.style.border = valid;
                }


            } else {
                swal({
                    title: "Email All Ready Exist....!",
                    text: "\n\n",
                    icon: "warning",
                    button: false,
                    timer: 1500
                });
                supplier.email = null;
                txtEmail.value = "";
            }

        } else {
            txtEmail.style.border = invalid;
            supplier.email = null;
        }
    } else {
        if (txtEmail.required) {
            txtEmail.style.border = invalid;
        } else {
            txtEmail.style.border = initial;
        }
        supplier.email = null;
    }
}

function txtLandNumberKU(){

    var val = txtLandNumber.value.trim();
    if (val != "") {
        var regpattern = new RegExp('^0\\d{9}$');
        if (regpattern.test(val)) {
            var response = httpRequest("supplier/byland?landnumber=" + val, "GET")
            if (response == "") {
                supplier.landno = val;
                if (oldsupplier != null && supplier.landno != oldsupplier.landno) {
                    txtLandNumber.style.border = updated;
                } else {
                    txtLandNumber.style.border = valid;
                }

            } else {
                swal({
                    title: "LandNumber All Ready Exist....!",
                    text: "\n\n",
                    icon: "warning",
                    button: false,
                    timer: 1500
                });
                supplier.landno = null;
                txtLandNumber.value = "";
            }

        } else {
            txtLandNumber.style.border = invalid;
            supplier.landno = null;
        }
    } else {
        if (txtLandNumber.required) {
            txtLandNumber.style.border = invalid;
        } else {
            txtLandNumber.style.border = initial;
        }
        supplier.landno = null;
    }
}

function refreshInnerForm() {

    SupplierHasMaterial = new Object();
    oldSupplierHasMaterial = null;


    fillCombo(cmbMaterial, "Select Material", materials, "materialname", "");

    $("#materialselect2parent .select2-container").css('border',initial);

    fillInnerTable("tblInnerMaterial", supplier.supplierHasMaterials, fillInnerForm, btnInnerDeleteMC, viewInnerMaterial)
    if (supplier.supplierHasMaterials.length != 0) {
        for (var index in supplier.supplierHasMaterials)
            tblInnerMaterial.children[1].children[index].lastChild.children[0].style.display = "none";
    }
}

function btnInnerAddMc() {

    var matext = false;
    // check duplicated values
    for (var index in supplier.supplierHasMaterials) {
        if (supplier.supplierHasMaterials[index].material_id.materialname == SupplierHasMaterial.material_id.materialname) {
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
        supplier.supplierHasMaterials.push(SupplierHasMaterial);
        refreshInnerForm();
    }


}

function fillInnerForm() {
}

function btnInnerDeleteMC(innerob, innerrow) {

    swal({
        title: "Are you sure to Delete following material...?",

        text: "\nMaterial Name :" + innerob.material_id.materialname,
        icon: "warning", buttons: true, dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                supplier.supplierHasMaterials.splice(innerrow, 1)
                refreshInnerForm();
            }
        });

}

function viewInnerMaterial() {
}

function setStyle(style) {


    txtCompanyName.style.border = style;
    txtEmail.style.border = style;
    txtContactPersonName.style.border = style;
    txxContactPersonMobile.style.border = style;
    txtLandNumber.style.border = style;
    txtBankName.style.border = style;
    txtBankBranchName.style.border = style;
    txtBankAccountName.style.border = style;
    txtBankAccountNumber.style.border = style;
    txtAddedDate.style.border = style;
    txtAddress.style.border = style;
    txtCredit.style.border = style;
    txtDescription.style.border = style;
    cmbSupplierStatus.style.border = style;
    cmbEmployee.style.border = style;

}

function disableButtons(add, upd, del) {

    if (add || !privilages.add) {
        btnAdd.setAttribute("disabled", "disabled");
        $('#btnAdd').css('cursor', 'not-allowed');
    } else {
        btnAdd.removeAttribute("disabled");
        $('#btnAdd').css('cursor', 'pointer');
    }
//initial ---> disableButtons(false, true, true);  // Update --- >disableButtons(true, false, false);
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
        $(".buttondel").prop('disabled', true); // prop -- > property
        $(".buttondel").css('cursor', 'not-allowed');
    } else {
        $(".buttondel").removeAttr("disabled");
        $(".buttondel").css('cursor', 'pointer');
    }

    // select deleted data row
    for (index in suppliers) {
        if (suppliers[index].supplierstatus_id.name == "Deleted") {
            tblSupplier.children[1].children[index].style.color = "#f00";
            tblSupplier.children[1].children[index].style.border = "2px solid red";
            tblSupplier.children[1].children[index].lastChild.children[1].disabled = true;
            tblSupplier.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

        }
    }

}


function getErrors() {

    var errors = "";
    addvalue = "";

    if (supplier.suppliercode == null) {
        errors = errors + "\n" + "Supplier Code Not Enter";
        txtSnumber.style.border = invalid;
    } else addvalue = 1;

    if (supplier.companyname == null) {
        errors = errors + "\n" + "Supplier Name Not Enter";
        txtCompanyName.style.border = invalid;
    } else addvalue = 1;

    if (supplier.address == null) {
        errors = errors + "\n" + "Supplier Address Not Enter";
        txtAddress.style.border = invalid;
    } else addvalue = 1;

    if (supplier.email == null) {
        errors = errors + "\n" + "Email Not Selected";
        txtEmail.style.border = invalid;
    } else addvalue = 1;

    if (supplier.landno == null) {
        errors = errors + "\n" + "Lan Number Not Enter";
        txtLandNumber.style.border = invalid;
    } else addvalue = 1;

    if (supplier.cpname == null) {
        errors = errors + "\n" + "Contact Person Name Not Enter";
        txtContactPersonName.style.border = invalid;
    } else addvalue = 1;

    if (supplier.cpmobile == null) {
        errors = errors + "\n" + "Contact Person Mobile Not Enter";
        txxContactPersonMobile.style.border = invalid;
    } else addvalue = 1;

    if (supplier.addeddate == null) {
        errors = errors + "\n" + "Added Date Not Enter";
        txtAddedDate.style.border = invalid;
    } else addvalue = 1;

    if (supplier.supplierstatus_id == null) {
        errors = errors + "\n" + "Supplier Status Not Selected";
        cmbSupplierStatus.style.border = invalid;
    } else addvalue = 1;

    if (supplier.employee_id.callingname == null) {
        errors = errors + "\n" + "Employee Not Selected";
        cmbEmployee.style.border = invalid;
    } else addvalue = 1;

    if (supplier.supplierHasMaterials.length == 0) {
        errors = errors + "\n" + "Material Not Selected";
        cmbMaterial.style.border = invalid;
    } else addvalue = 1;


    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {

        if (supplier.bankname != null || supplier.bankbranchname != null || supplier.bankacco != null || supplier.bankaccname != null){
            if(txtBankName.value != "" && txtBankBranchName.value != "" &&  txtBankAccountName.value != "" &&  txtBankAccountNumber.value != ""){
                if (txtDescription.value == "") {

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
            }else {
                swal({
                    title: "Some Required Bank Detail are Missing...!",
                    text: "\n" ,
                    icon: "error",
                    button: true,
                });

            }
        }

       else if (txtBankName.value == "" || txtBankBranchName.value == "" || txtBankAccountName.value == "" || txtBankAccountNumber.value == "" || txtDescription.value == "" || txtCredit.value == "") {

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
        title: "Are you sure to add following Supplier...?",
        text: "\nSupplier Code : " + supplier.suppliercode +
            "\nCompany Name : " + supplier.companyname +
            "\nEmail : " + supplier.email +
            "\nContact Person Name : " + supplier.cpname +
            "\nContact Person Mobile : " + supplier.cpmobile +
            "\nLand Number : " + supplier.landno +
            "\nAdded date : " + supplier.addeddate +
            "\nAddress: " + supplier.address +
            "\nSupplier Status : " + supplier.supplierstatus_id.name +
            "\nEmployee : " + supplier.employee_id.callingname,


        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/supplier", "POST", supplier);
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

    if (oldsupplier == null) {
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


function filldata(nsup) {
    clearSelection(tblSupplier);
    selectRow(tblSupplier, activerowno, active);

    supplier = JSON.parse(JSON.stringify(nsup));
    oldsupplier = JSON.parse(JSON.stringify(nsup));


    txtSnumber.value = supplier.suppliercode;
    txtCompanyName.value = supplier.companyname;
    txtEmail.value = supplier.email;
    txtContactPersonName.value = supplier.cpname;
    txxContactPersonMobile.value = supplier.cpmobile;
    txtLandNumber.value = supplier.landno;
    txtBankName.value = supplier.bankname;
    txtBankBranchName.value = supplier.bankbranchname;
    txtBankAccountName.value = supplier.bankaccname;
    txtBankAccountNumber.value = supplier.bankacco;
    txtAddedDate.value = supplier.addeddate;
    txtAddress.value = supplier.address;
    txtDescription.value = supplier.description;
    txtCredit.value = parseFloat(supplier.creditlimit).toFixed(2);


    fillCombo(cmbSupplierStatus, "Select Status", supplierstatus, "name", supplier.supplierstatus_id.name);
    fillCombo(cmbEmployee, "Select Employeee", employees, "callingname", supplier.employee_id.callingname);
    cmbSupplierStatus.disabled = false;


    disableButtons(true, false, false);
    setStyle(valid);

      //check null statements

    if (supplier.bankname == null && supplier.bankbranchname == null && supplier.bankaccname == null && supplier.bankacco == null){

        txtBankName.style.border = initial;
        txtBankBranchName.style.border = initial;
        txtBankAccountName.style.border = initial;
        txtBankAccountNumber.style.border = initial;
        $('#collapseOne').collapse('hide')
    }else {

        $('#collapseOne').collapse('show')
        dbank.style.display = "block";
    }


    if (supplier.description == null){
        txtDescription.style.border = initial;
    }

    if (supplier.creditlimit == null){
        txtDescription.style.border = initial;
    }

    refreshInnerForm();
    $('#formmodel').modal('show')


}

function getUpdates() {

    var updates = "";

    if (supplier != null && oldsupplier != null) {

        if (supplier.suppliercode != oldsupplier.suppliercode)
            updates = updates + "\nSupplier Code is Changed.." + oldsupplier.suppliercode + " into " + supplier.suppliercode;

        if (supplier.companyname != oldsupplier.companyname)
            updates = updates + "\nCompany Name is Changed.." + oldsupplier.companyname + " into " + supplier.companyname;

        if (supplier.address != oldsupplier.address)
            updates = updates + "\nAddress is Changed.." + oldsupplier.address + " into " + supplier.address;

        if (supplier.email != oldsupplier.email)
            updates = updates + "\nEmail is Changed.." + oldsupplier.email + " into " + supplier.email;

        if (supplier.landno != oldsupplier.landno)
            updates = updates + "\nLand Number is Changed.." + oldsupplier.landno + " into " + supplier.landno;

        if (supplier.cpname != oldsupplier.cpname)
            updates = updates + "\nContact Person is Changed.." + oldsupplier.cpname + " into " + supplier.cpname;

        if (supplier.cpmobile != oldsupplier.cpmobile)
            updates = updates + "\nContact Mobile is Changed.." + oldsupplier.cpmobile + " into " + supplier.cpmobile;

        if (supplier.bankname != oldsupplier.bankname)
            updates = updates + "\nBank Name is Changed.." + oldsupplier.bankname + " into " + supplier.bankname;

        if (supplier.bankbranchname != oldsupplier.bankbranchname)
            updates = updates + "\nBank Branch Name is Changed.." + oldsupplier.bankbranchname + " into " + supplier.bankbranchname;

        if (supplier.bankacco != oldsupplier.bankacco)
            updates = updates + "\nBank Account is Changed.." + oldsupplier.bankacco + " into " + supplier.bankacco;

        if (supplier.bankaccname != oldsupplier.bankaccname)
            updates = updates + "\nBank Account Name is Changed.." + oldsupplier.bankaccname + " into " + supplier.bankaccname;

        if (isEqual(supplier.supplierHasMaterials, oldsupplier.supplierHasMaterials , 'material_id'))
            updates = updates + "\nMaterial is Changed..";

        if (supplier.description != oldsupplier.description)
            updates = updates + "\nDescription is Changed.." + oldsupplier.description + " into " + supplier.description;

        if (supplier.creditlimit != oldsupplier.creditlimit)
            updates = updates + "\nCredit Limit is Changed.." + oldsupplier.creditlimit + " into " + supplier.creditlimit;

        if (supplier.supplierstatus_id.name != oldsupplier.supplierstatus_id.name)
            updates = updates + "\nSupplier Status is Changed.." + oldsupplier.supplierstatus_id.name + " into " + supplier.supplierstatus_id.name;

        if (supplier.employee_id.callingname != oldsupplier.employee_id.callingname)
            updates = updates + "\nEmployee is Changed.." + oldsupplier.employee_id.callingname + " into " + supplier.employee_id.callingname;

    }

    return updates;

}

function btnUpdateMC() {
    var errors = getErrors();
    if (errors == "") {
        var updates = getUpdates();
        if (updates == ""){
            swal({
                title: 'Nothing Updated..!', icon: "warning",
                text: '\n',
                button: false,
                timer: 1200
            });
        } else if(supplier.bankname != null || supplier.bankbranchname != null || supplier.bankacco != null || supplier.bankaccname != null){
            if(txtBankName.value != "" && txtBankBranchName.value != "" &&  txtBankAccountName.value != "" &&  txtBankAccountNumber.value != ""){
                swal({
                    title: "Are you sure to update following supplier details...?",
                    text: "\n" + getUpdates(),
                    icon: "warning", buttons: true, dangerMode: true,
                })
                    .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/supplier", "PUT", supplier);
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
                                $('#formmodel').modal('hide')



                            } else {
                                swal({
                                    title: 'Failed to Update as', icon: "error",
                                    text: '\n ' + response,
                                    button: true
                                });
                            }
                        }
                    });
            }else {
                swal({
                    title: "Some Required Bank Detail are Missing...!",
                    text: "\n" + getErrors(),
                    icon: "error",
                    button: true,
                });
            }

        } else {
            swal({
                title: "Are you sure to update following supplier details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/supplier", "PUT", supplier);
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
                            $('#formmodel').modal('hide')

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

function btnDeleteMC(sup) {
    supplier = JSON.parse(JSON.stringify(sup));

    swal({
        title: "Are you sure to delete following Supplier...?",
        text: "\n Supplier Number : " + supplier.suppliercode +
            "\n Company Name  : " + supplier.companyname,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/supplier", "DELETE", supplier);
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