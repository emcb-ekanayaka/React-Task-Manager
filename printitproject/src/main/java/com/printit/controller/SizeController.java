package com.printit.controller;

import com.printit.model.Size;
import com.printit.repository.SizeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/size")
public class SizeController {

    @Autowired  // to get a instance
    private SizeRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Size> sizeList(){
        return dao.findAll();
    }

    @GetMapping(value = "/listbysize", params = {"materialcategoryid"} , produces = "application/json")
    public List<Size>colorList(@RequestParam("materialcategoryid") Integer materialcategoryid){
        return dao.ListBySize(materialcategoryid);
    }
}
