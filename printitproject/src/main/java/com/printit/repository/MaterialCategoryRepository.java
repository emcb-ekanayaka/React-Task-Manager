package com.printit.repository;

import com.printit.model.Materialcategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialCategoryRepository extends JpaRepository<Materialcategory , Integer> {
}
