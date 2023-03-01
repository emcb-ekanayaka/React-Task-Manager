$(document).ready(function()
{

    if($('.bbb_viewed_slider').length)
    {
        var viewedSlider = $('.bbb_viewed_slider');

        viewedSlider.owlCarousel(
            {
                loop:true,
                margin:30,
                autoplay:true,
                autoplayTimeout:6000,
                nav:false,
                dots:false,
                responsive:
                    {
                        0:{items:1},
                        575:{items:2},
                        768:{items:3},
                        991:{items:4},
                        1199:{items:6}
                    }
            });

        if($('.bbb_viewed_prev').length)
        {
            var prev = $('.bbb_viewed_prev');
            prev.on('click', function()
            {
                viewedSlider.trigger('prev.owl.carousel');
            });
        }

        if($('.bbb_viewed_next').length)
        {
            var next = $('.bbb_viewed_next');
            next.on('click', function()
            {
                viewedSlider.trigger('next.owl.carousel');
            });
        }
    }
    valid = "2px solid green";
    invalid = "2px solid red";
    initial = "2px solid #d6d6c2";
    updated = "2px solid #ff9900";
    active = "#ff9900";

    divDesigns.style.display = "none";
    products = httpRequest("../product/webviewlist", "GET");
    designtypes = httpRequest("../productdesigntype/webdesignlist", "GET");
    producttype = httpRequest("../producttype/webproducttypelist", "GET");

    txtSearchName.addEventListener("keyup", btnSearchMC);
    loadView();
    loadForm();

});

function loadView(){

    txtSearchName.value = "";
    txtSearchName.style.background = "";

    //Table Area
    activerowno = "";
    activepage = 1;
    var query = "&searchtext=";
    loadTable(activepage, cmbPageSize.value, query);
}

function loadTable(page, size, query) {
    page = page - 1;
    producttypes = new Array();
    var data = httpRequest("/producttype/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) producttypes = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblproductimages', producttypes, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblproductimages);

    if (activerowno != "") selectRow(tblproductimages, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldcusrequest == null) {
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

function fillForm (){}
function btnDeleteMC (){}
function viewitem(){}
function loadForm(){

    cusrequest = new Object();
    oldcusrequest = null;

    cusrequest.customerrequestHasProductList = new Array();

    fillCombo(cmbproduct, "Select Product", products, "productcode", "");
    fillCombo(cmbdesigntype, "Select Design Code", designtypes, "designcode", "");
    fillCombo(cmbproducttype, "Select Product Type", producttype, "name", "");

    // Require Date
    dtarequire.min = getCurrentDateTime("date");
    let today = new Date();
    let afteroneweek = new Date();
    afteroneweek.setDate(today.getDate()+365);
    let month = afteroneweek.getMonth()+1;
    if (month < 10) month = "0" +month;
    let day = afteroneweek.getDate();
    if (day < 10) day = "0"+day;
    dtarequire.max = afteroneweek.getFullYear()+"-"+month+"-"+day;


    cusrequest.addeddate = getCurrentDateTime("date");

    fullname.value = "";
    txtemail.value = "";
    contact.value = "";

    fullname.style.border = initial;
    txtemail.style.border = initial;
    contact.style.border = initial;
    refreshInnerForm();
}


function customdetails(){

}
function disabledesigntype(){

    if (chkcustomerdesign.checked){
        customerrequesthasproduct.custermizeddesign = true;

        cmbdesigntype.disabled = true;
        cmbdesigntype.value ="";
        customerrequesthasproduct .designtype_id = 'No';
        console.log(customerrequesthasproduct .designtype_id);
        cmbdesigntype.style.border = initial;

    }else {
        customerrequesthasproduct .custermizeddesign = false;
        cmbdesigntype.disabled = false;

    }
}

function changeTab(viewname) {
    if(viewname=='Products'){
        tbProducts.classList.add('active');
        tbDesigns.classList.remove('active');
        divProducts.style.display = "block";
        divDesigns.style.display = "none";
    }
    if(viewname=='Designs'){
        tbProducts.classList.remove('active');
        tbDesigns.classList.add('active');
        divProducts.style.display = "none";
        divDesigns.style.display = "block";

    }

}

function refreshInnerForm(){
    customerrequesthasproduct = new Object();
    oldcustomerrequesthasproduct = null;

    cmbproduct.value ="";
    cmbdesigntype.value ="";
    orderqty.value ="";
    dtarequire.value ="";
    cmbproducttype.value ="";

    cmbproduct.style.border = initial;
    cmbdesigntype.style.border = initial;
    orderqty.style.border = initial;
    dtarequire.style.border = initial;
    cmbproducttype.style.border = initial;

    $('#chkcustomerdesign').bootstrapToggle('off')
    fillInnerTable("tblcustomRequest", cusrequest.customerrequestHasProductList, fillInnerForm, true, true)
}


function checkinnerempty(){
        var error = "";

        if (customerrequesthasproduct.product_id == null){
            error = error + "\n" + "Select A Product...!";
            cmbproduct.style.border = invalid;
        }

    if (customerrequesthasproduct.designtype_id == null){
        error = error + "\n" + "Select A Design...!";
        cmbdesigntype.style.border = invalid;
    }

    if (cusrequest.requiredate == null){
        error = error + "\n" + "Select A Require Date ...!";
        dtarequire.style.border = invalid;
    }

    if (customerrequesthasproduct.qty == null){
        error = error + "\n" + "Select A Qty...!";
        orderqty.style.border = invalid;
    }
        return error;

    }

function btnInnerAddMc() {

    if (checkinnerempty()==""){

        var matext = false;
        for (var index in   cusrequest.customerrequestHasProductList) {
            if (cusrequest.customerrequestHasProductList[index].product_id.productcode == customerrequestHasProduct.product_id.productcode) {
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

            cusrequest.customerrequestHasProductList.push(customerrequesthasproduct);
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

function fillInnerForm(){}
function btnInnerDeleteMC(){}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (cusrequest.fullname == null) {
        errors = errors + "\n" + "Full Name Not Enter";
        fullname.style.border = invalid;
    } else addvalue = 1;

    if (cusrequest.email == null) {
        errors = errors + "\n" + "Email Not Entered";
        email.style.border = invalid;
    } else addvalue = 1;

    if (cusrequest.contactnumber == null) {
        errors = errors + "\n" + "Contact Number Not Entered";
        contact.style.border = invalid;
    } else addvalue = 1;

    if (cusrequest.customerrequestHasProductList.length  == 0) {
        errors = errors + "\n" + "Product Form Can not be Empty";
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
        title: "Are you sure to add following Customer Order...?",
        text: "\nFull Name : " + cusrequest.fullname+
            "\nEmail : " + cusrequest.email +
            "\nContact Number : " + cusrequest.contactnumber,


        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/customerrequest", "POST", cusrequest);
            if (response == "0") {
                swal({
                    position: 'center',
                    icon: 'success',
                    title: 'Your Request has been Done \n Save SuccessFully..!',
                    text: '\n',
                    button: false,
                    timer: 1200
                });
                loadForm();
                $('#formmodelreq').modal('hide')
            } else swal({
                title: 'Save not Success... , You have following errors', icon: "error",
                text: '\n ' + response,
                button: true
            });
        }
    });

}
