package com.printit.repository;

import com.printit.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query("select pd from Product pd where (pd.productcode like concat('%',:searchtext,'%') or " +
            "trim(pd.productioncost) like concat('%',:searchtext,'%') or pd.description like concat('%',:searchtext,'%') or " +
            "trim(pd.addeddate) like concat('%',:searchtext,'%') or pd.designtype_id.designname like concat('%',:searchtext,'%') or pd.productstatus_id.name like concat('%',:searchtext,'%') or " +
            "trim(pd.profitratio) like concat('%',:searchtext,'%')or pd.employee_id.callingname like concat('%',:searchtext,'%') or pd.producttype_id.name like concat('%',:searchtext,'%'))")
            Page<Product> findAll(@Param("searchtext") String searchtext, Pageable of);


    @Query(value = "SELECT concat('PD', lpad(substring(max(p.productcode),3 )+1, 8, '0')) FROM print_it.product as p;" , nativeQuery = true)
    String getNextNumber();

    @Query("select new Product (pro.id , pro.productname, pro.productioncost, pro.profitratio) from Product pro where pro.productstatus_id.name='Add-Completed' order by pro.id desc")
    List<Product> list();

    @Query("select p from Product p where p.producttype_id.id=:producttypeid")
    List<Product>listbyproduct(@Param("producttypeid") Integer producttypeid);

    //Query For Get product list By Given Production order-Id and status should be on going and pending
    @Query("select p from Product p where p in (select pop.product_id from ProductionorderHasProduct pop where pop.productionorder_id.id=:productionorderid and pop.productionstatus_id.id=4 or pop.productionstatus_id.id=6)")
    List<Product> productlistbyproductionorder(@Param("productionorderid") Integer productionorderid);

    @Query("select new Product(p.id ,p.salesprice, p.productcode, p.productname , p.designedphoto) from Product p where p.designtype_id.customtype_id.name='In House'")
    List<Product> webviewlist();

    // to delivery module ---> when selecting corder product will be filter
    @Query("select p from Product p where p in (select cohp.product_id from CorderHasProduct cohp where cohp.corder_id.id=:corderid)")
    List<Product> listofproductbyselectingcorder(@Param("corderid") Integer corderid);
}
