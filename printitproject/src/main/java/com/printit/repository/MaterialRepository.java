package com.printit.repository;

import com.printit.model.Material;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MaterialRepository extends JpaRepository<Material , Integer> {

    @Query("select m from Material m where(m.materialcode like concat('%',:searchtext,'%')) or " +
            "m.materialname like concat('%',:searchtext,'%') or   m.materialname like concat('%',:searchtext,'%') or " +
            "m.materialstatus_id.name like concat('%',:searchtext,'%') or trim(m.nopieces) like concat('%',:searchtext,'%')")
    Page<Material> findAll(String searchtext, Pageable of);

    @Query(value = "SELECT concat('M' , lpad(substring(max(m.materialcode),2)+1 , 9 , '0')) FROM print_it.material as m;" , nativeQuery = true)
    String getNextNumber();

    //Query For Get material By Given Quotation request Id
    @Query("select m from Material m where m in (select qr.material_id from QuotationRequestHasMaterial as qr where qr.quotationrequest_id.id=:quotationrequestid)")
    List<Material> Listbymaterial(@Param("quotationrequestid") Integer quotationrequestid);

    //Query For Get material By Given supplier Id
    @Query("select m from Material m where m.materialstatus_id.id=1 and m in (select s.material_id from SupplierHasMaterial as s where s.supplier_id.id=:supplierid)")
    List<Material> matirialListBySupplier(@Param("supplierid") Integer supplierid);

    //Query For Get material By Given Quotation Id
    @Query("select m from Material m where m in (select q.material_id from QuotationHasMaterial as q where q.quotation_id.id=:quotationid)")
    List<Material> matirialListByQuotation(@Param("quotationid") Integer quotationid);

    //Query For Get material By Given purchase order Id
    @Query("SELECT m FROM Material m where m in (SELECT pm.material_id FROM PorderHasMaterial as pm where pm.porder_id.id=:porderid)")
    List<Material> matirialListByporder(@Param("porderid") Integer porderid);

    //Query in Repository to check duplicated materials for materal UI
    @Query("select m from Material m where m.materialname=:materialname")
    Material findBymaterialname(@Param("materialname") String materialname);

    @Query("select new Material(m.id , m.materialname) from Material m where m.materialstatus_id.name='Available'")
    List<Material> list();

}
