

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            $('[data-toggle="tooltip"]').tooltip()


            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);

            txtSearchName.addEventListener("keyup",btnSearchMC);

            privilages = httpRequest("../privilage?module=PRODUCTTYPE","GET");

            designTypes = httpRequest("../designtype/list","GET");
            maxproducts = httpRequest("../maxproductqty/list","GET");

            valid = "2px solid green";
            invalid = "2px solid red";
            initial = "2px solid #d6d6c2";
            updated = "2px solid #ff9900";
            active = "#ff9900";

            loadView();                      //To Load View Side
            loadForm();                     //To Refresh the Form Side
            $('#formmodel').modal('hide')
        }

        function loadView() {

            //Search Area
            txtSearchName.value="";
            txtSearchName.style.background = "";

            //Table Area
            activerowno = "";
            activepage = 1;
            var query = "&searchtext=";
            loadTable(1,cmbPageSize.value,query);
        }

        function loadTable(page,size,query) {
            page = page - 1;
            producttypes = new Array();
            var data = httpRequest("/producttype/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) producttypes = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblProductImge',producttypes,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblProductImge);

            if(activerowno!="")selectRow(tblProductImge,activerowno,active);

        }

        function paginate(page) {
            var paginate;
            if(oldproducttype==null){
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

        function clearaddphoto(){
            fileproductphoto.value ="";
            imgviewphoto.src = "";
            producttype.producttypephoto = null;
            producttype.imagename = null;
            picname.value = "";
            imgviewphoto.style.display = "none";
            picname.style.border = initial;
            picname.disabled = true;

        }

        function viewitem(pdt,rowno) {

            productimage = JSON.parse(JSON.stringify(pdt));

            tblproductName.innerHTML = productimage.name;
            tblproductCost.innerHTML = productimage.productcost;
            tblprofitRatio.innerHTML = productimage.profitratio;
            tbldesigntype.innerHTML = productimage.dtype_id.name;

            if(productimage.producttypephoto==null)
                tblImage.src= 'resources/image/noimage.png';
             else
                tblImage.src = atob(productimage.producttypephoto);

            $('#dataviewModal').modal('show')

         }

         function btnprintrowMC(){
             var format = printformtable.outerHTML;

             var newwindow=window.open();
             newwindow.document.write("<html>" +
                 "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
                 "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'></head>" +
                 "<body><div style='margin-top: 150px'><h1> Product Design Details :</h1></div>" +
                 "<div>"+format+"</div>" +
                 "<script>printformtable.removeAttribute('style')</script>" +
                 "</body></html>");
             setTimeout(function () {
                 newwindow.print();
                 newwindow.close();
             },100);
         }


        function loadForm() {
            producttype = new Object();
            oldproducttype = null;

            fillCombo(cmbProductDesignType,"Select Design Type",designTypes,"name","");
            fillCombo(cmbMaxQty,"Select Max Product Qty",maxproducts,"qty","");

            cmbMaxQty.value = "";
            txtProductName.value = "";
            txtProductCost.value = "";
            txtProfitRatio.value = "";
            cmbProductDesignType.value = "";
            fileproductphoto.value = "";
            picname.value = "";
            picname.value = "";

             /*removeFile('flePhoto');*/
            fileproductphoto.value ="";
            imgviewphoto.src = "";
            imgviewphoto.style.display = "none";
            picname.disabled = true;
            picname.value ="";

            setStyle(initial);
            disableButtons(false, true, true);
        }

        function setStyle(style) {


            cmbMaxQty.style.border = style;
            txtProductName.style.border = style;
            txtProductCost.style.border = style;
            txtProfitRatio.style.border = style;
            cmbProductDesignType.style.border = style;
            fileproductphoto.style.border = style;

        }

        function disableButtons(add, upd, del) {

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

        }

        function getErrors() {

            var errors = "";
            addvalue = "";

            if (producttype.name == null) {
                txtProductName.style.border = invalid;
                errors = errors + "\n" + "Product Name Not Enter";
            }
            else  addvalue = 1;

            if (producttype.dtype_id == null){
                cmbProductDesignType.style.border = invalid;
                errors = errors + "\n" + "Product Design Type Not Selected";
            }
            else  addvalue = 1;

            if (producttype.producttypephoto == null){
                fileproductphoto.style.border = invalid;
                errors = errors + "\n" + "Product Image Not Selected";
            }
            else  addvalue = 1;

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
                title: "Are you sure to add following Product Design Type...?" ,
                  text :"\nProduct Name : " + producttype.name +
                    "\nProduct Cost : " + producttype.productcost +
                    "\nMax Product Qty : " + producttype.maxproductqty_id.qty +
                    "\nProduct Profit : " + producttype.profitratio +
                    "\nProduct Type : " + producttype.dtype_id.name,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/producttype", "POST", producttype);
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
                        activepage = 1;
                        loadSearchedTable();
                        loadForm();
                        $('#formmodel').modal('hide')
                    }
                    else
                        swal({
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

            if(oldproducttype == null && addvalue == ""){
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

        function fillForm(prodt,rowno){
            activerowno = rowno;


            if (oldproducttype == null) {
                filldata(prodt);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(prodt);

                    }

                });
            }

        }


        function filldata(prodt) {
            clearSelection(tblProductImge);
            selectRow(tblProductImge,activerowno,active);

            producttype = JSON.parse(JSON.stringify(prodt));
            oldproducttype = JSON.parse(JSON.stringify(prodt));

            txtProductName.value = producttype.name;
            txtProductCost.value = producttype.productcost;
            txtProfitRatio.value = producttype.profitratio;
            cmbProductDesignType.value = producttype.dtype_id.name;

            //photo area fill --> if there any photo in selected row display them in the model view
            if (producttype.producttypephoto != null){
                imgviewphoto.src = atob(producttype.producttypephoto);
            }else
                imgviewphoto.src = "resources/images/noimage.png";
                imgviewphoto.style.display = "block";

            fillCombo(cmbProductDesignType, "Select Product Type", designTypes, "name", producttype.dtype_id.name);

            disableButtons(true, false, false);
            setStyle(valid);
            $('#formmodel').modal('show')

        }

        function getUpdates() {

            var updates = "";

            if(producttype !=null && oldproducttype !=null) {

                if (producttype.name != oldproducttype.name)
                    updates = updates + "\nProduct Name is Changed.." + oldproducttype.name + " into " + producttype.name;

                if (producttype.productcost != oldproducttype.productcost)
                    updates = updates + "\nProduct Cost is Changed.." + oldproducttype.productcost + " into " + producttype.productcost;

                if (producttype.profitratio != oldproducttype.profitratio)
                    updates = updates + "\nProfit Ratio is Changed.." + oldproducttype.profitratio + " into " + producttype.profitratio;

                if (producttype.dtype_id.name != oldproducttype.dtype_id.name)
                    updates = updates + "\nProduct Design Type Is changed.." + oldproducttype.dtype_id.name + " into " + producttype.dtype_id.name;

                if (producttype.producttypephoto != oldproducttype.producttypephoto){
                    updates = updates + "\nImage is Changed.."
                }

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
                        title: "Are you sure to update following Product Design details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/producttype", "PUT", producttype);
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

        function btnDeleteMC(pdt) {
            producttype = JSON.parse(JSON.stringify(pdt));

            swal({
                title: "Are you sure to delete following Product Design...?",
                text: "\n Product Name : " + producttype.name +
                "\n Design Type  : " + producttype.dtype_id.name,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/producttype","DELETE",producttype);
                    if (responce==0) {
                        swal({
                            title: "Deleted Successfully....!",
                            text: "\n\n  Deleted Permanently",
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
        }

        function btnSearchClearMC(){
               loadView();
        }

       function btnPrintTableMC(productdesign) {

            var newwindow = window.open();
            formattab = tblProductImge.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px; '> <h1>Product Image Type Details : </h1></div>" +
                "<div>"+ formattab+"</div>"+
               "</body>" +
                "</html>");
           setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
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