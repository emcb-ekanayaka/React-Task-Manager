package com.printit.controller;

import com.printit.model.Color;
import com.printit.repository.ColorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/color")
public class ColorController {

    @Autowired  // to get a instance
    private ColorRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Color> colorList(){
        return dao.findAll();
    }

    @GetMapping(value = "/listbycolor", params = {"materialcategoryid"} , produces = "application/json")
    public List<Color>colorList(@RequestParam("materialcategoryid") Integer materialcategoryid){
        return dao.ListByColor(materialcategoryid);
    }
}
