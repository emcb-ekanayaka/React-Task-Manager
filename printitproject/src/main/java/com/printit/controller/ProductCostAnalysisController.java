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

@RestController //To set the class readable
@RequestMapping(value = "/productcostanalysis")
public class ProductCostAnalysisController {

    @Autowired // to get a instance
    private UserService userService;

    @Autowired // to get a instance
    private PrevilageController previlageController;

    @Autowired
    private ProductRepository productdao;

    @Autowired //To create a Instence for this
    private ProductStatusRepository daoproductsatus;

    @Autowired
    private ProductCostAnalysisRepository dao;

    @Autowired //To create a Instence for this
    private ProductcoststatusRepository daosatus;

 /*   ///productcostanalysis/lastpca?productid=1
    @GetMapping(value = "/lastpca",params = {"productid"}, produces = "application/Json")
    public Productcostanalysis lastPCA(@RequestParam("productid") int productid){
        List<Productcostanalysis> pcalistbyproduct = dao.getListByProduct(productid);
        Productcostanalysis nextpcostcode = pcalistbyproduct.get(0);
        return nextpcostcode;
    }*/

   @GetMapping(value = "/nextnumber" , produces = "application/Json")
    public Productcostanalysis nextNumber(){
        String nextNumber = dao.getNextNumber();
       Productcostanalysis nextpcostcode = new Productcostanalysis(nextNumber);
        return nextpcostcode;
    }

    //Get Request Mapping For Get Supplier page Request given Params
    @GetMapping(value = "/findAll" , params ={"page", "size"}, produces = "application/Json") //values type will return as a json object.
    public Page<Productcostanalysis> findAll(@RequestParam("page") int page , @RequestParam("size") int size){


        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"PRODUCTCOST");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

    //Get Request Mapping For Get Supplier page Request given Params with Search Value
    @GetMapping(value = "/findAll" , params ={"page", "size","searchtext"}, produces = "application/Json") //values type will return as a json object.
    public Page<Productcostanalysis> findAll(@RequestParam("page") int page , @RequestParam("size") int size , @RequestParam("searchtext") String searchtext){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"PRODUCTCOST");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

    //post mapping for insert Quotation object
    @PostMapping
    public String insert(@RequestBody Productcostanalysis productcostanalysis) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PRODUCTCOST");

        //check user null
        if (user != null && priv != null && priv.get("add")) {
            try {

                for (ProductcostanalysisHasMaterial pca : productcostanalysis.getProductcostanalysisHasMaterialList())
                    pca.setProductcostanalysis_id(productcostanalysis);

                dao.save(productcostanalysis);

                Product product = productdao.getById(productcostanalysis.getProduct_id().getId());
                product.setSalesprice(productcostanalysis.getSalesprice());
                product.setProductstatus_id(daoproductsatus.getById(4));

                for (ProductHasMaterial phm : product.getProductHasMaterialList())
                    phm.setProduct_id(product);
                productdao.save(product);
                return "0";
            } catch (Exception ex) {
                return "Add not completed " + ex.getMessage();
            }
        } else
            return "error add..! You Have No Privilage...";
    }

   //put mapping for insert Supplier object
    @PutMapping
    public String update(@RequestBody Productcostanalysis productcostanalysis) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PRODUCTCOST");

        //check user null
        if (user != null && priv != null && priv.get("update")) {
            try {


                for (ProductcostanalysisHasMaterial pca : productcostanalysis.getProductcostanalysisHasMaterialList())
                    pca.setProductcostanalysis_id(productcostanalysis);

                dao.save(productcostanalysis);
                return "0";
            } catch (Exception ex) {
                return "Update not completed " + ex.getMessage();
            }
        } else
            return "error update..! You Have No Privilage...";
    }

     //Delete mapping for Supplier object
    @DeleteMapping
    public String delete(@RequestBody Productcostanalysis productcostanalysis){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PRODUCTCOST");

        //check user null
        if (user != null && priv != null && priv.get("delete")) {
            try{
                productcostanalysis.setPcoststatus_id(daosatus.getById(3));

                for (ProductcostanalysisHasMaterial pca : productcostanalysis.getProductcostanalysisHasMaterialList())
                    pca.setProductcostanalysis_id(productcostanalysis);

                dao.save(productcostanalysis);
                return "0";
            }catch (Exception ex){
                return "Delete not completed "+ex.getMessage();
            }
        } else
            return "error deleting..! You Have No Privilage...";
    }
}
