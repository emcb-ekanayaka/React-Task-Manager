package com.printit.controller;

import com.printit.model.*;
import com.printit.repository.*;
import com.printit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/product")
public class ProductController {

    @Autowired // to get a instance
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private ProductRepository dao;

    @Autowired
    private ProducttypeRepository daoproducttype;

    @Autowired //To create a Instence for this
    private ProductStatusRepository daosatus;

    @Autowired //To create a Instence for this
    private ProductdesignRepository daoproductdesign;

    @Autowired //To create a Instence for this
    private ProductdesignstatusRepository daoprroductdesignstatus;

    @GetMapping(value = "/webviewlist", produces = "application/json")
    public List<Product> webViewList(){
        return dao.webviewlist();
    }

    //Get Request For Product list
    @GetMapping(value = "/list" , produces = "application/Json")
    public List<Product> productList(){
        return dao.list();
    }

    //Get Request For Product list by given production order code
    @GetMapping(value = "/byproductionorder" ,params = {"productionorderid"}, produces = "application/Json")
    public List<Product> productList(@RequestParam("productionorderid") int productionorderid){
        return dao.productlistbyproductionorder(productionorderid);
    }

    //Get Request For Product list by product type
    @GetMapping(value = "/listbyproducttype" ,params = {"producttypeid"}, produces = "application/Json")
    public List<Product> productlistbyproducttype(@RequestParam("producttypeid") int producttypeid){
        return dao.listbyproduct(producttypeid);
    }

    // to delivery module ---> when selecting corder product will be filter
    @GetMapping(value = "/listbyproduct" ,params = {"corderid"}, produces = "application/Json")
    public List<Product> listofprodutbyselecingcorder(@RequestParam("corderid") int corderid){
        return dao.listofproductbyselectingcorder(corderid);
    }

    @GetMapping(value = "/nextnumber" , produces = "application/Json")
    public Product nextNumber(){
        String nextNumber = dao.getNextNumber();
        Product nextproduct = new Product(nextNumber);
        return nextproduct;
    }

    //Get Request Mapping For Get Supplier page Request given Params
    @GetMapping(value = "/findAll" , params ={"page", "size"}, produces = "application/Json") //values type will return as a json object.
    public Page<Product> findAll(@RequestParam("page") int page , @RequestParam("size") int size){


        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"PRODUCT");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

    //Get Request Mapping For Get Supplier page Request given Params with Search Value
    @GetMapping(value = "/findAll" , params ={"page", "size","searchtext"}, produces = "application/Json") //values type will return as a json object.
    public Page<Product> findAll(@RequestParam("page") int page , @RequestParam("size") int size , @RequestParam("searchtext") String searchtext){
        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"PRODUCT");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

   //post mapping for insert Quotation object
    @PostMapping
    public String insert(@RequestBody Product product) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PRODUCT");

        //check user null
        if (user != null && priv != null && priv.get("add")) {
            try {


                Producttype ptype = daoproducttype.getById(product.getProducttype_id().getId());
                ptype.setProductcost(String.valueOf(product.getProductioncost()));
                ptype.setProfitratio(product.getProfitratio());

                for (ProductHasMaterial pro : product.getProductHasMaterialList())
                    pro.setProduct_id(product);

                dao.save(product);
                daoproducttype.save(ptype);

                Productdesigntype pd = daoproductdesign.getById(product.getDesigntype_id().getId());
                pd.setDstatus_id(daoprroductdesignstatus.getById(4));
                daoproductdesign.save(pd);
                return "0";
            } catch (Exception ex) {
                return "Add not completed " + ex.getMessage();
            }
        } else
            return "error add..! You Have No Privilage...";
    }

    //put mapping for insert Supplier object
    @PutMapping
    public String update(@RequestBody Product product) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PRODUCT");

        //check user null
        if (user != null && priv != null && priv.get("update")) {
            try {

                Producttype ptype = daoproducttype.getById(product.getProducttype_id().getId());
                ptype.setProductcost(String.valueOf(product.getProductioncost()));
                ptype.setProfitratio(product.getProfitratio());

                for (ProductHasMaterial pro : product.getProductHasMaterialList())
                    pro.setProduct_id(product);

                dao.save(product);
                daoproducttype.save(ptype);
                return "0";
            } catch (Exception ex) {
                return "Update not completed " + ex.getMessage();
            }
        } else
            return "error update..! You Have No Privilage...";
    }

    //Delete mapping for Supplier object
    @DeleteMapping
    public String delete(@RequestBody Product product){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PRODUCT");

        //check user null
        if (user != null && priv != null && priv.get("delete")) {
            try{
                product.setProductstatus_id(daosatus.getById(3));

                for (ProductHasMaterial pro : product.getProductHasMaterialList())
                    pro.setProduct_id(product);

                dao.save(product);
                return "0";
            }catch (Exception ex){
                return "Delete not completed "+ex.getMessage();
            }
        } else
            return "error deleting..! You Have No Privilage...";
    }
}
