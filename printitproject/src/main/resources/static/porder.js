

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);

            cmbSupplier.addEventListener("change",cmbSupplierCH);
            //cmbQuotation.addEventListener("change",cmbQuotationCH);
            //cmbmaterial.addEventListener("change",cmbmaterialCH);
            txtqty.addEventListener("keyup",calculatech);

            $('.js-example-basic-single').select2();

            txtSearchName.addEventListener("keyup",btnSearchMC);

            privilages = httpRequest("../privilage?module=PURCHASEORDER","GET");

            podersuppliers = httpRequest("../supplier/list","GET");
            poderquotations = httpRequest("../quotation/list","GET");
            poderstatus = httpRequest("../porderstatus/list","GET");
            porderemployees = httpRequest("../employee/list","GET");

            //inner form
            pordermaterials = httpRequest("../material/list","GET");

            valid = "2px solid green";
            invalid = "2px solid red";
            initial = "2px solid #d6d6c2";
            updated = "2px solid #ff9900";
            active = "#ff9900";

            loadView();
            loadForm();
        }

        function loadView() {

            //Search Area
            txtSearchName.value="";
            txtSearchName.style.background = "";

            //Table Area
            activerowno = "";
            activepage = 1;
            var query = "&searchtext=";
            loadTable(activepage,cmbPageSize.value,query);
        }

        function loadTable(page,size,query) {
            page = page - 1;
            porders = new Array();
          var data = httpRequest("/porder/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) porders = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblPorder',porders,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblPorder);

            if(activerowno!="")selectRow(tblPorder,activerowno,active);

        }

        function paginate(page) {
            var paginate;
            if(oldporder==null){
                paginate=true;
            }else{
                if(getErrors()==''&&getUpdates()==''){
                    paginate=true;
                }else{
                    paginate = window.confirm("Form has Some Errors or Update Values. " +
                        "Are you sure to discard that changes ?");
                }
            }
            if(paginate) {
                activepage=page;
                activerowno=""
                loadForm();
                loadSearchedTable();
            }

        }

        function viewitem(po,rowno) {

            viewporder = JSON.parse(JSON.stringify(po));

            tblPOrder.innerHTML = viewporder.pordercode;
            tblSupplier.innerHTML = viewporder.supplier_id.companyname;
            tblQuotation.innerHTML = viewporder.quotation_id.qno;
            tblRequireDate.innerHTML = viewporder.requiredate;
            tblTotalAmount.innerHTML = parseFloat(viewporder.totalamount).toFixed(2);

            tblAddedDate.innerHTML = viewporder.addeddate;
            tblStatus.innerHTML = viewporder.porderstatus_id.name;
            tblEmployeee.innerHTML = viewporder.employee_id.callingname;
            if (viewporder.description!=null){
                tblDescription.innerHTML = viewporder.description;
            }

            fillInnerTable("tblPrintInnerMaterial", viewporder.porderHasMaterialList, fillInnerForm, btnInnerDeleteMC, viewInnerMaterial)
            $('#Qrmodal').modal('show')

         }

        function btnprintrowMC() {

            var format = printformtable.outerHTML;

            var newwindow = window.open();
            newwindow.document.write("<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
                "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'></head>" +
                "<body><div style='margin-top: 150px'><h1>Purchasse Order Details :</h1></div>" +
                "<div>" + format + "</div>" +
                "<script>printformtable.removeAttribute('style')</script>" +
                "</body></html>");
            setTimeout(function () {
                newwindow.print();
                newwindow.close();
            }, 100);

        }

        function loadForm() {
            porder = new Object();
            oldporder = null;

            porder.porderHasMaterialList = new Array();

             fillCombo(cmbSupplier,"Select Supplier",podersuppliers,"companyname","");
             fillCombo(cmbStatus,"Select Status",poderstatus,"name","Order");
            porder.porderstatus_id = JSON.parse(cmbStatus.value);
            cmbStatus.disabled = true;
             fillCombo(cmbQuotation,"Select Quotation",poderquotations,"qno","");
             fillCombo(cmbemployee,"Select Employee",porderemployees,"callingname", session.getObject('activeuser').employeeId.callingname);
            porder.employee_id = JSON.parse(cmbemployee.value);
            cmbemployee.disabled = true;


            dtaaddeddate.value= getCurrentDateTime("date");
            porder.addeddate = dtaaddeddate.value;
            dtaaddeddate.disabled = true;
            dtaaddeddate.style.border = valid;

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/porder/nextnumber", "GET");
            txtOnumber.value = nextNumber.pordercode;
            porder.pordercode = txtOnumber.value;
            txtOnumber.disabled="disabled";


            dtarequiredate.min = getCurrentDateTime("date");
            let today = new Date();
            let afteroneweek = new Date();
            afteroneweek.setDate(today.getDate()+7);
            let month = afteroneweek.getMonth()+1;
            if (month < 10) month = "0" +month; // [0-10]
            let day = afteroneweek.getDate(); // range (1-31)
            if (day < 10) day = "0"+day;
            dtarequiredate.max = afteroneweek.getFullYear()+"-"+month+"-"+day;

            txtDescription.value = "";
            cmbSupplier.value = "";
            txtTotalamount.value = "";

             setStyle(initial);

            if (cmbSupplier.value==""){
                cmbQuotation.disabled = true;
            }
            cmbemployee.style.border=valid;
            cmbStatus.style.border=valid;
            dtaaddeddate.style.border=valid;
            txtOnumber.style.border=valid;

            cmbSupplier.disabled = false;
             disableButtons(false, true, true);
            refreshInnerForm();
        }

        function cmbSupplierCH(){

            quotationlistbysupplier = httpRequest("/quotation/listbyquotation?supplierid=" + JSON.parse(cmbSupplier.value).id, "GET" );
            fillCombo(cmbQuotation,"Select Quotation",quotationlistbysupplier,"qno","");
            cmbQuotation.disabled = false;
            $("#quatationselect2parent .select2-container").css('border',initial);
            $("#materialselect2parent .select2-container").css('border',initial);
            porder.quotation_id = null;
            fillCombo(cmbmaterial, "Select Material", pordermaterials, "materialname", "");
            var creditlimit  =  (parseFloat(JSON.parse(cmbSupplier.value).creditlimit)).toFixed(2);
            supcreditlimit.innerHTML = creditlimit;
            refreshInnerForm();
        }

        function cmbQuotationCH(){

            materiallistbyquotation = httpRequest("/material/listByMaterial?quotationid=" + JSON.parse(cmbQuotation.value).id, "GET" );
            fillCombo(cmbmaterial, "Select Material", materiallistbyquotation, "materialname", "");

            porder.porderHasMaterialList = new Array();
            fillInnerTable("tblInnerMaterial", porder.porderHasMaterialList, fillInnerForm, btnInnerDeleteMC, true)

            refreshInnerForm();

        }

        function cmbmaterialCH(){

            var data = httpRequest("/quatationhasmaterial/byquatationhasmaterial?quotationid=" + JSON.parse(cmbQuotation.value).id + "&materialid=" + JSON.parse(cmbmaterial.value).id , "GET");
            txtPurchaseprice.value  = data.purchaseprice;
            min.value  = JSON.parse(data.minqty);
            max.value  = JSON.parse(data.maxqty);
            txtPurchaseprice.style.border = valid;
            porderHasMaterial.purchaseprice = txtPurchaseprice.value;
            txtPurchaseprice.disabled = true;
            txtqty.value  ="";
            txtqty.style.border = initial;
            txtLineTotal.value  ="";
            txtLineTotal.style.border = initial;
            txtqty.disabled=false;

        }

        function minvalue(){
            txtqty.value = min.value;
            txtqty.style.border = valid;
            porderHasMaterial.qty = txtqty.value;
            calculatech();
        }

        function maxvalue(){
            txtqty.value = max.value;
            txtqty.style.border = valid;
            porderHasMaterial.qty = txtqty.value;
            calculatech();
        }

        function calculatech(){

            if (min.value != "" && max.value !=""){
                if (JSON.parse(min.value) <= txtqty.value && JSON.parse(max.value) >= txtqty.value && txtqty.value != ""){

                        txtLineTotal.value = (parseFloat(txtPurchaseprice.value) * parseFloat(txtqty.value)).toFixed(2);
                        txtLineTotal.style.border = valid;
                        if (porderHasMaterial!=null && oldporderHasMaterial != null){
                            if (porderHasMaterial.qty != oldporderHasMaterial.qty){
                                txtLineTotal.style.border = updated;
                            }else {
                                txtLineTotal.style.border = valid;
                            }
                        }
                        porderHasMaterial.linetotal =  txtLineTotal.value;

                }else{
                    swal({
                        title: 'Can not Enter..!', icon: "warning",
                        text: '\n',
                        button: false,
                        timer: 1200
                    });
                    txtLineTotal.value = "";
                    txtLineTotal.style.border = initial;
                    porderHasMaterial.linetotal= null;
                    txtqty.style.border = initial;
                    txtqty.value = "";
                    porderHasMaterial.qty= null;
                }
            }else {
                if (txtqty.value != 0 ){
                    txtLineTotal.value = (parseFloat(txtPurchaseprice.value) * parseFloat(txtqty.value)).toFixed(2);
                    txtLineTotal.style.border = valid;
                    if (porderHasMaterial!=null && oldporderHasMaterial != null){
                        if (porderHasMaterial.qty != oldporderHasMaterial.qty){
                            txtLineTotal.style.border = updated;
                        }else {
                            txtLineTotal.style.border = valid;
                        }
                    }
                    porderHasMaterial.linetotal =  txtLineTotal.value;
                }else {

                    swal({
                        title: 'Can not Enter..!', icon: "warning",
                        text: '\n',
                        button: false,
                        timer: 1200
                    });
                    txtqty.value = "";
                    txtqty.style.border = initial;
                    porderHasMaterial.qty= null;
                    txtLineTotal.value = "";
                    txtLineTotal.style.border = initial;
                    porderHasMaterial.linetotal= null;
                }
            }
        }

        function refreshInnerForm() {

            porderHasMaterial = new Object();
            oldporderHasMaterial = null;

            min.value ="";
            max.value ="";
            totalamount= 0 ;

            $("#materialselect2parent .select2-container").css('border',initial);
            txtPurchaseprice.value = "";
            txtqty.value = "";
            txtLineTotal.value = "";

            txtPurchaseprice.style.border = initial;
            txtqty.style.border = initial;
            txtLineTotal.style.border = initial;
            cmbmaterial.style.border = initial;

            txtPurchaseprice.disabled = true;
            txtLineTotal.disabled = true;

            fillInnerTable("tblInnerMaterial", porder.porderHasMaterialList, fillInnerForm, btnInnerDeleteMC, true)

            if (cmbQuotation.value != ""){
                fillCombo(cmbmaterial, "Select Material", materiallistbyquotation, "materialname", "");
            }
            if (porder.porderHasMaterialList.length!=0){
                for (var index in porder.porderHasMaterialList){
                    totalamount = (parseFloat(totalamount) + parseFloat(porder.porderHasMaterialList[index].linetotal)).toFixed(2);
                }
                    porder.totalamount = totalamount;
                    txtTotalamount.value = porder.totalamount;



                if (oldporder != null && porder.totalamount != oldporder.totalamount){
                    txtTotalamount.style.border = updated;
                }else {
                    txtTotalamount.style.border = valid;
                }
            }else {
                txtTotalamount.value = "";
                porder.totalamount = null;
                txtTotalamount.style.border = initial;
            }

            if (cmbQuotation.value !=""){
                cmbmaterial.disabled = false;
                txtqty.disabled = false;

                btnInnerupdate.disabled = true;
                btnInnerAdd.disabled = false;
                btnInnerClear.disabled = false;
            }else {

                porder.porderHasMaterialList = new Array();
                fillInnerTable("tblInnerMaterial", porder.porderHasMaterialList, fillInnerForm, btnInnerDeleteMC, true)

                cmbmaterial.disabled = true;
                txtqty.disabled = true;

                porder.totalamount = null;
                txtTotalamount.value = "";
                txtTotalamount.disabled = true;
                txtTotalamount.style.border = initial;

                btnInnerupdate.disabled = true;
                btnInnerAdd.disabled = true;
                btnInnerClear.disabled = true;

            }

            if (oldporder != null && porder.porderstatus_id.name == "Completed" || porder.porderstatus_id.name == "Received" ||  porder.porderstatus_id.name == "Deleted"  ||  porder.porderstatus_id.name == "Cancel" ){
                cmbmaterial.disabled=true;
                txtPurchaseprice.disabled=true;
                txtqty.disabled=true;
                txtLineTotal.disabled=true;

                btnInnerClear.disabled=true;
                btnInnerupdate.disabled=true;
                btnInnerAdd.disabled=true;
                fillInnerTable("tblInnerMaterial", porder.porderHasMaterialList, fillInnerForm, false, false)
            }else{

                txtqty.disabled=true;
                btnInnerClear.disabled=false;
                btnInnerupdate.disabled=false;
            }
            btnInnerupdate.disabled=true;
        }

        function checkinnerempty(){
            var error = "";

            if (porderHasMaterial.material_id == null){
                error = error + "\n" + "Select A Material...!";
                cmbmaterial.style.border = invalid;
            }

            if(porderHasMaterial.purchaseprice == null){
                error = error + "\n" + "Purchase-Price Not Confirm...!";
                txtPurchaseprice.style.border = invalid;
            }

            if (porderHasMaterial.qty == null){
                error = error + "\n" + "Quantity Not Enter...!";
                txtqty.style.border = invalid;
            }

            if (porderHasMaterial.linetotal == null){
                error = error + "\n" + "Line Total Not Confirm...!";
                txtLineTotal.style.border = invalid;
            }
            return error;
        }

        function checkcreditlimit(){

            let addedpreviousamouts = 0;
            for (let ind in porders){
                    if (porders[ind].supplier_id.companyname == porder.supplier_id.companyname && porders[ind].porderstatus_id.name == "Order"){
                        let alltotalvalue =  porders[ind].totalamount;
                        addedpreviousamouts = alltotalvalue + addedpreviousamouts ;
                    }
            }
            creditallowedornot = true;
            balancecredit = 0;
            var creditlimit  =  (parseFloat(JSON.parse(cmbSupplier.value).creditlimit)).toFixed(2);
            var arrestamount  =  (parseFloat(JSON.parse(cmbSupplier.value).arrestamount)).toFixed(2);
            var allowedlimit  = parseFloat(creditlimit) - parseFloat(arrestamount) - parseFloat(addedpreviousamouts);
            balancecredit = allowedlimit;

            var currenttotalamount = 0 ;

            if (porder.porderHasMaterialList.length == 0){
                currenttotalamount = parseFloat(porderHasMaterial.linetotal);

                if (currenttotalamount > balancecredit){
                    balancecredit = allowedlimit;
                    creditallowedornot = false;
                }else {
                    balancecredit = parseFloat(balancecredit) - parseFloat(currenttotalamount);
                    console.log(balancecredit)
                }

            }else {
                    currenttotalamount = parseFloat(txtTotalamount.value) + parseFloat(porderHasMaterial.linetotal);
                    if (balancecredit >= currenttotalamount){
                        creditallowedornot = true;
                        balancecredit = parseFloat(balancecredit) - parseFloat(porderHasMaterial.linetotal);

                    }else {
                        balancecredit = allowedlimit - parseFloat(txtTotalamount.value);
                        creditallowedornot = false;
                    }
                }
            if (oldporderHasMaterial != null){
                updatecurrenttotalamount = parseFloat(txtTotalamount.value) - parseFloat(oldporderHasMaterial.linetotal);
                updatecurrenttotalamount = updatecurrenttotalamount + parseFloat(porderHasMaterial.linetotal);

                if (allowedlimit >= updatecurrenttotalamount){
                    creditallowedornot = true;
                }else {
                    creditallowedornot = false;
                }
                if (updatecurrenttotalamount > balancecredit){
                    balancecredit = allowedlimit - (parseFloat(txtTotalamount.value) - parseFloat(oldporderHasMaterial.linetotal));
                    console.log(allowedlimit)
                    console.log(txtTotalamount.value)
                    console.log(oldporderHasMaterial.linetotal)
                    console.log(balancecredit)
                }else {
                    balancecredit = balancecredit - updatecurrenttotalamount;
                }

            }


            return creditallowedornot;

        }

        function btnInnerAddMc() {
            if(checkinnerempty() == ""){
                var matext = false;
                for (var index in porder.porderHasMaterialList) {
                    if (porder.porderHasMaterialList[index].material_id.materialname == porderHasMaterial.material_id.materialname) {
                        matext = true;
                        break;
                    }
                }
                if (matext) {
                    swal({
                        title: 'Material Name Is Already Excited..!', icon: "warning",
                        text: '\n ',
                        button: false,
                        timer: 1200
                    });
                } else {

                    if (checkcreditlimit()){
                        porder.porderHasMaterialList.push(porderHasMaterial);
                        refreshInnerForm();

                    }else {
                        swal({
                            title: 'Credit limit Excited..!', icon: "warning",
                            text: '\nAvailable Credit:'+ balancecredit,
                            button: false,
                            timer: 1200
                        });
                    }


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

        function fillInnerForm(ob, innrrowno) {
            innerrow = innrrowno
            porderHasMaterial = JSON.parse(JSON.stringify(ob));
            oldporderHasMaterial = JSON.parse(JSON.stringify(ob));
            btnInnerupdate.disabled = false;
            btnInnerAdd.disabled = true;

         fillCombo(cmbmaterial, "Select Material", materiallistbyquotation, "materialname", porderHasMaterial.material_id.materialname);
            cmbmaterial.disabled = true;
            cmbmaterial.style.border = valid;
            txtPurchaseprice.value = parseFloat(porderHasMaterial.purchaseprice).toFixed(2);
            txtPurchaseprice.style.border = valid;
            txtqty.value = porderHasMaterial.qty;
            txtqty.disabled=false;
            txtqty.style.border = valid;
            txtLineTotal.value = parseFloat(porderHasMaterial.linetotal).toFixed(2);
            txtLineTotal.style.border = valid;

        }

        function getInnerUpdates() {

            var innerupdates = "";

            if(porderHasMaterial!=null && oldporderHasMaterial!=null) {
                if (porderHasMaterial.qty != oldporderHasMaterial.qty)
                    innerupdates = innerupdates + "\nQuantity Changed.." + oldporderHasMaterial.qty + " into " + porderHasMaterial.qty;

            }
            return innerupdates;
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
                    }
                });

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
                if(checkinnerempty() == ""){
                    if (porderHasMaterial.qty == null) {
                        swal({
                            title: 'Qty Can not be null ..!', icon: "warning",
                            text: '\n',
                            button: false,
                            timer: 1200
                        });
                    } else {

                        if (checkcreditlimit()){
                            porder.porderHasMaterialList[innerrow] = porderHasMaterial;
                            refreshInnerForm();

                        }else {
                            swal({
                                title: 'Credit limit Excited..!', icon: "warning",
                                text: '\nAvailable Credit:'+ balancecredit,
                                button: false,
                                timer: 1200
                            });
                        }


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



        }

        function btnInnerDeleteMC(innerob, innerrow) {

            swal({
                title: "Are you sure to Delete following material...?",

                text: "\nMaterial Name :" + innerob.material_id.materialname,
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        porder.porderHasMaterialList.splice(innerrow, 1)
                        refreshInnerForm();
                    }
                });

        }

        function viewInnerMaterial() {
        }

        function setStyle(style) {

            $("#quatationselect2parent .select2-container").css('border',style);
            cmbQuotation.style.border = style;
            cmbSupplier.style.border = style;
            dtarequiredate.style.border = style;
            txtTotalamount.style.border = style;
            txtDescription.style.border = style;
            dtaaddeddate.style.border = style;
            cmbStatus.style.border = style;
            cmbemployee.style.border = style;

        }

        function disableButtons(add, upd, del){

            if (add || !privilages.add) {
                btnAdd.setAttribute("disabled", "disabled");
                $('#btnAdd').css('cursor','not-allowed');
            }
            else {
                btnAdd.removeAttribute("disabled");
                $('#btnAdd').css('cursor','pointer')
            }

            if (upd || !privilages.update) {
                btnUpdate.setAttribute("disabled", "disabled");
                $('#btnUpdate').css('cursor','not-allowed');
            }
            else {
                btnUpdate.removeAttribute("disabled");
                $('#btnUpdate').css('cursor','pointer');
             }

            if (!privilages.update) {
                $(".buttonup").prop('disabled', true);
                $(".buttonup").css('cursor','not-allowed');
            }
            else {
                $(".buttonup").removeAttr("disabled");
                $(".buttonup").css('cursor','pointer');
            }

            if (!privilages.delete){
                $(".buttondel").prop('disabled', true);
                $(".buttondel").css('cursor','not-allowed');
            }
            else {
                $(".buttondel").removeAttr("disabled");
                $(".buttondel").css('cursor','pointer');
            }

            // select deleted data row
            for(index in porders){
                if(porders[index].porderstatus_id.name =="Deleted"){
                    tblPorder.children[1].children[index].style.color = "#f00";
                    tblPorder.children[1].children[index].style.border = "2px solid red";
                    tblPorder.children[1].children[index].lastChild.children[1].disabled = true;
                    tblPorder.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }

        function getErrors() {

            var errors = "";
            addvalue = "";

            if (porder.pordercode == null){
                errors = errors + "\n" + "Purchase Order Code Not Enter";
                txtOnumber.style.border = invalid;
            }
            else  addvalue = 1;

            if (porder.supplier_id  == null){
                errors = errors + "\n" + "Supplier Not Selected";
                cmbSupplier.style.border = invalid;
            }
            else  addvalue = 1;

            if (porder.quotation_id == null){
                errors = errors + "\n" + "Quotation Not Selected";
                cmbQuotation.style.border = invalid;
            }
            else  addvalue = 1;

            if (porder.requiredate == null){
                errors = errors + "\n" + "Require-Date Not Selected";
                dtarequiredate.style.border = invalid;
            }
            else  addvalue = 1;

            if (porder.totalamount == null){
                errors = errors + "\n" + "Total Amount Is Not Confirm";
                txtTotalamount.style.border = invalid;
            }
            else  addvalue = 1;

            if (porder.addeddate == null){
                errors = errors + "\n" + "Date Not Selected";
                dtaaddeddate.style.border = invalid;
            }
            else  addvalue = 1;

            if (porder.porderstatus_id == null){
                errors = errors + "\n" + "Status Not Selected";
                cmbStatus.style.border = invalid;
            }
            else  addvalue = 1;

            if (porder.employee_id == null){
                errors = errors + "\n" + "Employee Not Selected";
                cmbemployee.style.border = invalid;
            }
            else  addvalue = 1;

            if (porder.porderHasMaterialList.length == 0){
                errors = errors + "\n" + "Material Not Selected";
                cmbmaterial.style.border = invalid;
            }
            else  addvalue = 1;

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
                title: "Are you sure to add following Purchase Order...?" ,
                  text :  "\nQuotation Request Number : " + porder.pordercode +
                    "\nSupplier Name : " + porder.supplier_id.companyname +
                    "\nQuotation Number : " + porder.quotation_id.qno +
                    "\nRequire Date : " + porder.requiredate +
                    "\nTotal amount : " + porder.totalamount +
                    "\nAdded Date : " + porder.addeddate +
                    "\nStatus : " + porder.porderstatus_id.name +
                    "\nEmployee : " + porder.employee_id.callingname,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/porder", "POST", porder);
                    if (response == "0") {
                        swal({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been Done \n Save SuccessFully..!',
                            text: '\n',
                            button: false,
                            timer: 1200
                        });
                        activerowno = 1;
                        loadSearchedTable();
                        loadForm();
                        $('#formmodel').modal('hide')
                    }
                    else swal({
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

            if(oldemployee == null && addvalue == ""){
                loadForm();
            }else{
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        loadForm();
                    }

                });
            }

        }

        function fillForm(qr,rowno){
            activerowno = rowno;

            if (oldporder==null) {
                filldata(qr);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(qr);
                    }

                });
            }

        }

        function filldata(po) {
            clearSelection(tblPorder);
            selectRow(tblPorder,activerowno,active);

            porder = JSON.parse(JSON.stringify(po));
            oldporder = JSON.parse(JSON.stringify(po));

            txtOnumber.value = porder.pordercode;
            dtarequiredate.value =porder.requiredate;
            txtTotalamount.value =porder.totalamount;
            txtDescription.value =porder.description;
            dtaaddeddate.value =porder.addeddate;

            fillCombo(cmbSupplier, "Select Supplier", podersuppliers, "companyname", porder.supplier_id.companyname);
            cmbSupplier.disabled = true;

            fillCombo(cmbStatus, "Select Status", poderstatus, "name", porder.porderstatus_id.name);
            cmbStatus.disabled = false;

            fillCombo(cmbemployee, "", porderemployees, "callingname", porder.employee_id.callingname);

            fillCombo(cmbQuotation, "", poderquotations, "qno", porder.quotation_id.qno);
            cmbQuotation.disabled = true;

            console.log(cmbQuotation.value);
            console.log(porder.quotation_id.qno);
            materiallistbyquotation = httpRequest("/material/listByMaterial?quotationid=" + JSON.parse(cmbQuotation.value).id, "GET" );
            fillCombo(cmbmaterial, "Select Material", materiallistbyquotation, "materialname", "");
            cmbmaterial.disabled = true;

            setStyle(valid);

            disableButtons(true, false, false);


            if (porder.txtDescription == null){
                txtDescription.style.border = initial;
            }
            refreshInnerForm();
            $('#formmodel').modal('show')


        }

        function getUpdates() {

            var updates = "";

            if(porder!=null && oldporder!=null) {

                if (porder.pordercode != oldporder.pordercode)
                    updates = updates + "\nPurchase Code Number is Changed.." + oldporder.pordercode + " into " + porder.pordercode;

                if (porder.supplier_id.companyname  != oldporder.supplier_id.companyname )
                    updates = updates + "\nSupplier is Changed.." + oldporder.supplier_id.companyname  + " into " + porder.supplier_id.companyname;

                if (porder.quotation_id.qno != oldporder.quotation_id.qno)
                    updates = updates + "\nQuotation is Changed.." + oldporder.quotation_id.qno + " into " + porder.quotation_id.qno;

                if (porder.requiredate != oldporder.requiredate)
                    updates = updates + "\nRequire Date is Changed.." + oldporder.requiredate + " into " + porder.requiredate;

                if (porder.totalamount != oldporder.totalamount)
                    updates = updates + "\nTotal Amount is Changed.." + oldporder.totalamount + " into " + porder.totalamount;

                if (porder.description != oldporder.description)
                    updates = updates + "\nDescription is Changed.." + oldporder.description + " into " + porder.description;

                if (porder.addeddate != oldporder.addeddate)
                    updates = updates + "\nAdded Date is Changed.." + oldporder.addeddate + " into " + porder.addeddate;

                if (porder.porderstatus_id.name != oldporder.porderstatus_id.name)
                    updates = updates + "\nStatus is Changed.." + oldporder.porderstatus_id.name + " into " + porder.porderstatus_id.name;

                if (porder.employee_id.callingname != oldporder.employee_id.callingname)
                    updates = updates + "\nEmployee is Changed.." + oldporder.employee_id.callingname + " into " + porder.employee_id.callingname;

                if (isEqual(porder.porderHasMaterialList, oldporder.porderHasMaterialList , 'material_id'))
                    updates = updates + "\nMaterial is Changed..";

                if (isEqualtolist(porder.porderHasMaterialList, oldporder.porderHasMaterialList , 'qty'))
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
                        title: "Are you sure to update following Purchase order details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/porder", "PUT", porder);
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

        function btnDeleteMC(po) {
            porder = JSON.parse(JSON.stringify(po));

            swal({
                title: "Are you sure to delete following Purchase Order...?",
                text: "\n Purchase Order Number : " + porder.pordercode +
                "\n Supplier Name : " + porder.supplier_id.companyname,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/porder","DELETE",porder);
                    if (responce==0) {
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

            var query ="&searchtext=";

            if(searchtext!="")
                query = "&searchtext=" + searchtext;
            //window.alert(query);
            loadTable(activepage, cmbPageSize.value, query);

        }

        function btnSearchMC(){
            activepage=1;
            loadSearchedTable();
            disableButtons(false, true, true);

        }

        function btnSearchClearMC(){
               loadView();
        }

       function btnPrintTableMC(qr) {

            var newwindow = window.open();
            formattab = tblPorder.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
               "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'></head>" +
                "<body><div style='margin-top: 150px; '> <h1>Purchase Order Details : </h1></div>" +
                "<div>"+ formattab+"</div>"+
               "</body>" +
                "</html>");
           setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
        }

        function sortTable(cind) {
            cindex = cind;

         var cprop = tblEmployee.firstChild.firstChild.children[cindex].getAttribute('property');

           if(cprop.indexOf('.') == -1) {
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
           }else {
               employees.sort(
                   function (a, b) {
                       if (a[cprop.substring(0,cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.')+1)] < b[cprop.substring(0,cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.')+1)]) {
                           return -1;
                       } else if (a[cprop.substring(0,cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.')+1)] > b[cprop.substring(0,cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.')+1)]) {
                           return 1;
                       } else {
                           return 0;
                       }
                   }
               );
           }
            fillTable('tblEmployee',employees,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblEmployee);
            loadForm();

            if(activerowno!="")selectRow(tblEmployee,activerowno,active);


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
