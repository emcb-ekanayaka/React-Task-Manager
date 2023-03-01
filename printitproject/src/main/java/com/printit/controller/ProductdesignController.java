package com.printit.controller;

import com.printit.model.Productdesigntype;
import com.printit.model.User;
import com.printit.repository.ProductdesignRepository;
import com.printit.repository.ProductdesignstatusRepository;
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
@RequestMapping(value = "/productdesigntype")
public class ProductdesignController {

    @Autowired // to get a instance
    private UserService userService;

    @Autowired // to get a instance
    private PrevilageController previlageController;

    @Autowired // to get a instance
    private ProductdesignRepository dao;

    @Autowired //To create a Instence for this
    private ProductdesignstatusRepository daosatus;

    @GetMapping(value = "/webdesignlist", produces = "application/json")
    public List<Productdesigntype> webdesignlist(){
        return dao.webDesignList() ;
    }

    @GetMapping(value = "/list", produces = "application/json")
    public List<Productdesigntype> designerList(){
        return dao.findAll() ;
    }

    //design code list when selecting design type In Product UI
    @GetMapping(value = "/listbydesigntype", produces = "application/json")
    public List<Productdesigntype> listBydesign(@RequestParam("listbydesigntype") int listbydesigntype){
        return dao.listofdesingcode(listbydesigntype);
    }

    @GetMapping(value = "/nextNumber" , produces = "application/Json")
    public Productdesigntype nextNumber(){
        String nextNumber = dao.getNextNumber();
        Productdesigntype nextProductDesign = new Productdesigntype(nextNumber);
        return nextProductDesign;
    }

    //Get Request Mapping For Get Product Design Type page Request by Given Params
    @GetMapping(value = "/findAll", params = {"page", "size"} ,produces = "application/Json")
    public Page<Productdesigntype> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {


        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PRODUCTDESIGNTYPE");

        //check user null
        if (user != null && priv != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;
    }

    //Get Request Mapping For Get Product Design Type page Request by Given Params With search
    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"},produces = "application/Json")
    public Page<Productdesigntype> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {


        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PRODUCTDESIGNTYPE");

        //check user null
        if (user != null && priv != null && priv.get("select")) {
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else
            return null;
    }

    @PostMapping
    public String insert(@RequestBody Productdesigntype productdesigntype) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PRODUCTDESIGNTYPE");

        //check user null
        if (user != null && priv != null && priv.get("add")) {
            try {
                dao.save(productdesigntype);
                return "0";
            } catch (Exception ex) {
                return "Add not completed " + ex.getMessage();
            }
        } else
            return "error add..! You Have No Privilage...";
    }

    //post mapping for insert custoer object
    @PutMapping
    public String update(@RequestBody Productdesigntype productdesigntype){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PRODUCTDESIGNTYPE");

        //check user null
        if (user != null && priv != null && priv.get("update")) {
            try{
                dao.save(productdesigntype);
                return "0";
            }catch (Exception ex){
                return "Update not completed "+ex.getMessage();
            }
        } else
            return "error update..! You Have No Privilage...";
    }

    @DeleteMapping
    public String delete(@RequestBody Productdesigntype productdesigntype) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PRODUCTDESIGNTYPE");

        //check user null
        if (user != null && priv != null && priv.get("delete")) {
        try {
            productdesigntype.setDstatus_id(daosatus.getById(3));
            dao.save(productdesigntype);
            return "0";
        } catch (Exception ex) {
            return "Delete not completed " + ex.getMessage();
        }
    } else
            return "error deleting..! You Have No Privilage...";
}
}
