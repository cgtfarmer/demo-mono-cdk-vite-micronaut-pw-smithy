package com.cgtfarmer.app;

import com.smithy.api.RootApi;
import com.smithy.model.GetHealthResponseContent;
import io.micronaut.http.annotation.Controller;

// Note: Uses the annotations from the RootApi interface
@Controller
public class RootController implements RootApi {

  // @Get("/health")
  public GetHealthResponseContent getHealth() {
    return new GetHealthResponseContent("Healthy");
  }
}
