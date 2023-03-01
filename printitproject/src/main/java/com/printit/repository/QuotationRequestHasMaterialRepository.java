package com.printit.repository;

import com.printit.model.QuotationRequestHasMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface QuotationRequestHasMaterialRepository extends JpaRepository<QuotationRequestHasMaterial, Integer> {

    @Query("SELECT q FROM QuotationRequestHasMaterial q where q.material_id.id=:materialid and q.quotationrequest_id.id=:quotationreqid")
    QuotationRequestHasMaterial getbyquotationRequest(@Param("materialid") Integer materialid, @Param("quotationreqid") Integer quotationreqid);
}
