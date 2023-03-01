package com.printit.repository;

import com.printit.model.Supplierstatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierStatusRepository extends JpaRepository<Supplierstatus, Integer> {
}
