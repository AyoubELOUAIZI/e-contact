package estm.dsic.jee.rest;

import estm.dsic.jee.util.CorsFilter;
import jakarta.annotation.Priority;
import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.container.DynamicFeature;
import jakarta.ws.rs.container.ResourceInfo;
import jakarta.ws.rs.core.Application;
import jakarta.ws.rs.core.FeatureContext;
import jakarta.ws.rs.ext.Provider;

@ApplicationPath("/api")
public class RestApplication extends Application {
    // this part to fix the cors issue
      @Provider
    @Priority(value = 1)
    public static class CorsFilterFeature implements DynamicFeature {
        @Override
        public void configure(ResourceInfo resourceInfo, FeatureContext context) {
            context.register(CorsFilter.class);
        }
    }

}