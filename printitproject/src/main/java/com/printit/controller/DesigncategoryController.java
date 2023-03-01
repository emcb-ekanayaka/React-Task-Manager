package com.printit.controller;

import com.printit.model.Dcategory;
import com.printit.repository.DesigncategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/designcategory")
public class DesigncategoryController {

    @Autowired // to get a instance
    private DesigncategoryRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Dcategory> designcategoryList(){
        return dao.findAll() ;
    }
}
