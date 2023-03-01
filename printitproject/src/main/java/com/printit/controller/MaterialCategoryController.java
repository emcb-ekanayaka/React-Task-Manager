package com.printit.controller;

import com.printit.model.Materialcategory;
import com.printit.repository.MaterialCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/materialcategory")
public class MaterialCategoryController {

    @Autowired // to get a instance
    private MaterialCategoryRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Materialcategory> materialCategorylist(){
        return dao.findAll();
    }
}
