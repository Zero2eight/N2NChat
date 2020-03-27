package org.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(value = "/")
public class WebController {
    @RequestMapping(value = "/Login", method = RequestMethod.GET)
    public String Login() {
        return "Login-SignUp";
    }

    @RequestMapping(value = "/Login", method = RequestMethod.POST)
    public String LoginPOST() {
        return "redirect: /LoginSuccess";
    }

    @RequestMapping(value = {"/","/LoginSuccess"}, method = RequestMethod.GET)
    public String LoginSuccess(Model model) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = user.getUsername();
        model.addAttribute("username",username);
        return "LoginSuccess";
    }

    @RequestMapping(value = "/SignUpSuccess", method = RequestMethod.POST)
    public String SignUpSuccess(Model model) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = user.getUsername();
        model.addAttribute("username",username);
        return "SignUpSuccess";
    }
}
