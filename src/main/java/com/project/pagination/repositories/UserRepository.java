package com.project.pagination.repositories;

import java.util.ArrayList;
import java.util.Date;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.project.pagination.models.User;

@Repository 												
public interface UserRepository extends CrudRepository<User,Long>{
	public ArrayList<User> findByCreatedAtBetween(Date start,Date end);
	public ArrayList<User> findByName(String name);
}
