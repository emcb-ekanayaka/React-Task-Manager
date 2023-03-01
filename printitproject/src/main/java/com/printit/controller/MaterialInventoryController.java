package com.printit.controller;

import com.printit.model.*;
import com.printit.repository.MaterialInventoryRepository;
import com.printit.repository.MaterialInventoryStatusRepository;
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
@RequestMapping(value = "/materialinventory")
public class MaterialInventoryController {

    @Autowired //To create a Instence for this
    private MaterialInventoryRepository dao;

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired //To create a Instence for this
    private MaterialInventoryStatusRepository daosatus;

    @GetMapping(value = "/bymaterial" ,params = {"materialid"}, produces = "application/Json")
    public Materialinventory inventorymaterial(@RequestParam("materialid") Integer materialid ){
        return dao.listbymaterial(materialid);
    }


    //Get Request Mapping For Get Material page Request given Params
    @GetMapping(value = "/findAll" , params ={"page", "size"}, produces = "application/Json") //values type will return as a json object.
    public Page<Materialinventory> findAll(@RequestParam("page") int page , @RequestParam("size") int size){


        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"MATERIALINVENTORY");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

    //Get Request Mapping For Get Material page Request given Params with Search Value
    @GetMapping(value = "/findAll" , params ={"page", "size","searchtext"}, produces = "application/Json") //values type will return as a json object.
    public Page<Materialinventory> findAll(@RequestParam("page") int page , @RequestParam("size") int size , @RequestParam("searchtext") String searchtext){
        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"MATERIALINVENTORY");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }



    //Delete mapping for custoer object
    @DeleteMapping
    public String delete(@RequestBody Materialinventory materialinventory){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "GRN");

        //check user null
        if (user != null && priv != null && priv.get("delete")) {
            try{
                materialinventory.setInventorystatus_id(daosatus.getById(3));

                dao.save(materialinventory);
                return "0";
            }catch (Exception ex){
                return "Delete not completed "+ex.getMessage();
            }
        } else
            return "error deleting..! You Have No Privilage...";
    }

}
