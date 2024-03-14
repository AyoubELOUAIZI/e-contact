package estm.dsic.jee.util;

import jakarta.servlet.*;
import jakarta.servlet.annotation.*;
import jakarta.servlet.http.*;
import java.io.*;

@WebFilter("/*")
public class CorsFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}

    // @Override
    // public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    //     HttpServletResponse httpResponse = (HttpServletResponse) response;
    //     // Allow requests from any origin
    //     httpResponse.setHeader("Access-Control-Allow-Origin", "*");
    //     // Allow GET, POST, OPTIONS methods
    //     httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT,DELETE, OPTIONS");
    //     // Allow specific headers
    //     httpResponse.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization");
    //     // Allow credentials
    //     httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
    //     chain.doFilter(request, response);
    // }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        // Get the origin of the incoming request
        String origin = ((HttpServletRequest) request).getHeader("Origin");
        // Set the Access-Control-Allow-Origin header to the origin of the request
        httpResponse.setHeader("Access-Control-Allow-Origin", origin);
        // Allow GET, POST, OPTIONS methods
        httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        // Allow specific headers
        httpResponse.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization");
        // Allow credentials
        httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
        chain.doFilter(request, response);
    }

    // @Override
    // public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    //     HttpServletResponse httpResponse = (HttpServletResponse) response;
    //     // Get the origin of the incoming request
    //     String origin = ((HttpServletRequest) request).getHeader("Origin");

    //     // Allow requests only from http://localhost:3000
    //     if (origin != null && origin.equals("http://localhost:3000")) {
    //         // Set the Access-Control-Allow-Origin header to the origin of the request
    //         httpResponse.setHeader("Access-Control-Allow-Origin", origin);
    //         // Allow GET, POST, PUT, DELETE, OPTIONS methods
    //         httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    //         // Allow specific headers
    //         httpResponse.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization");
    //         // Allow credentials
    //         httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
    //     }
    // }

    @Override
    public void destroy() {}
}
