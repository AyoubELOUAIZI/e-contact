package estm.dsic.jee.controllers;

import estm.dsic.jee.models.Contact;
import estm.dsic.jee.services.ContactService;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/contacts")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ContactController {
    @Inject
    private ContactService contactService;

    @GET
    @Path("/{ownerId}")
    public Response getAllContactsByOwnerId(@PathParam("ownerId") Long ownerId) {
        try {
            List<Contact> contacts = contactService.getAllContactsByOwnerId(ownerId);
            return Response.ok(contacts).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error fetching contacts: " + e.getMessage()).build();
        }
    }

    @POST
    public Response createContact(Contact contact) {
        try {
            Contact createdContact = contactService.createContact(contact);
            return Response.ok(createdContact).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error creating contact: " + e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response updateContact(@PathParam("id") Long id, Contact contact) {
        try {
            Contact updatedContact = contactService.updateContact(id, contact);
            if (updatedContact != null) {
                return Response.ok(updatedContact).build();
            } else {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("Contact not found with id: " + id).build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error updating contact: " + e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response deleteContact(@PathParam("id") Long id) {
        try {
            contactService.deleteContact(id);
            return Response.ok().entity("Contact deleted successfully").build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error deleting contact: " + e.getMessage()).build();
        }
    }
}
