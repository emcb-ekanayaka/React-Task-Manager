package com.printit.repository;


import com.printit.model.QuotationHasMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface QuatationHasMaterialRepository extends JpaRepository<QuotationHasMaterial, Integer> {

    @Query("select qhm from QuotationHasMaterial qhm where qhm.material_id.id =:materialid and qhm.quotation_id.id=:quotationid")
    QuotationHasMaterial listbyquotionmaterial(@Param("quotationid") Integer quotationid , @Param("materialid") Integer materialid);
}
