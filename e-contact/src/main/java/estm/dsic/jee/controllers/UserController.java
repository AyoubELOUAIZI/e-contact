package estm.dsic.jee.controllers;

import estm.dsic.jee.models.User;
import estm.dsic.jee.services.UserService;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserController {
    @Inject
    private UserService userService;

    @GET
    public Response getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return Response.ok(users).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error fetching users: " + e.getMessage()).build();
        }
    }

    @POST
    @Path("/signup")
    public Response signUpUser(User user) {
        System.out.println("\n\n\nthe signup methed is called " + user);
        try {
            User createdUser = userService.createUser(user);
            return Response.ok(createdUser).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error creating user in signup: " + e.getMessage()).build();
        }
    }

    @POST
    @Path("/signin")
    public Response signInUser(User user) {
        try {
            User signedInUser = userService.signInUser(user.getEmail(), user.getPassword());
            System.out.println("User to sign in"+ signedInUser);
            if (signedInUser != null) {
                if (signedInUser.isSubscribed()) {
                    return Response.ok(signedInUser).build(); // User is subscribed, allow sign-in
                } else {
                    return Response.status(Response.Status.UNAUTHORIZED)
                            .entity("Your account is not verified yet. Please try again later or contact the admin.")
                            .build();
                }
            } else {
                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity("Invalid credentials").build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error signing in: " + e.getMessage()).build();
        }
    }

    @POST
    @Path("/signout")
    public Response signOutUser() {
        try {
            // Implement sign-out logic
            // Example: Invalidate user session/token
            // Return success message
            return Response.ok().entity("User signed out successfully").build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error signing out: " + e.getMessage()).build();
        }
    }

    @POST
    public Response createUser(User user) {
        try {
            User createdUser = userService.createUser(user);
            return Response.ok(createdUser).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error creating user: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/{id}")
    public Response getUserById(@PathParam("id") Long id) {
        try {
            User user = userService.getUserById(id);
            if (user != null) {
                return Response.ok(user).build();
            } else {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("User not found with id: " + id).build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error fetching user: " + e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response updateUser(@PathParam("id") Long id, User user) {
        try {
            User updatedUser = userService.updateUser(id, user);
            if (updatedUser != null) {
                return Response.ok(updatedUser).build();
            } else {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("User not found with id: " + id).build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error updating user: " + e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response deleteUser(@PathParam("id") Long id) {
        try {
            userService.deleteUser(id);
            return Response.ok().entity("User deleted successfully").build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error deleting user: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/search")
    public Response searchUsers(@QueryParam("keyword") String keyword) {
        try {
            List<User> users = userService.searchUsersByKeyword(keyword);
            return Response.ok(users).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error searching users: " + e.getMessage()).build();
        }
    }

    @POST
    @Path("/{userId}/subscribe")
    public Response subscribeUser(@PathParam("userId") Long userId, @QueryParam("adminId") Long adminId) {
        try {
            boolean isAdmin = userService.subscribeUser(adminId, userId);
            if (isAdmin) {
                return Response.ok().entity("User subscribed successfully").build();
            } else {
                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity("Only admin can subscribe users").build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error subscribing user: " + e.getMessage()).build();
        }
    }
}
