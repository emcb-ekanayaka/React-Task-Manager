package com.printit.repository;

import com.printit.model.Qrstatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuotationRequestStatusRepository extends JpaRepository<Qrstatus, Integer> {
}
