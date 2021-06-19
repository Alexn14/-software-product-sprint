package com.google.sps.servlets;
                                
import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
                                                       
@WebServlet("/shades")
public class BestShadesServlet extends HttpServlet {
    String listOfShades[] = {"Turquoise Blue", "Celeste", "Navy", "Cyan", "Light Turquoise"};
                            
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String json = convertToJsonUsingGson(listOfShades);
    response.setContentType("application/json;");
    response.getWriter().println(json);
  }

  private String convertToJsonUsingGson(String[] list) {
    Gson gson = new Gson();
    String json = gson.toJson(list);
    return json;
  }
}
