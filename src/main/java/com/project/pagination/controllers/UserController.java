package com.project.pagination.controllers;

import java.security.Principal;
import java.util.Date;
import java.util.ArrayList;
import java.text.SimpleDateFormat;
import java.text.ParseException;

import org.springframework.web.bind.annotation.CrossOrigin;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.project.pagination.repositories.UserRepository;
import com.project.pagination.models.User;

@Controller
public class UserController{
	private UserRepository uR;

	public UserController(UserRepository uR){
		this.uR=uR;
	}
	
	@CrossOrigin(origins={"http://localhost:3000"})
	@RequestMapping("/users")
	@ResponseBody
	public ArrayList<User> all(){
		return (ArrayList<User>)uR.findAll();
	}

	@CrossOrigin(origins={"http://localhost:3000"})
	@RequestMapping("/users/{id}")
	@ResponseBody
	public User find(@PathVariable("id") Long id){
		return (User)uR.findOne(id);
	}

	@CrossOrigin(origins={"http://localhost:3000"})
	@PostMapping("/users/new")
	@ResponseBody
	public User create(@RequestBody User user){
		uR.save(user);
		return user;
	}
}
