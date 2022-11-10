import { Controller, Inject } from "@nestjs/common";
import { AuthService } from "./services/auth.service";

@Controller()
export class ServiceController {
  @Inject(AuthService)
  private readonly service: AuthService;
}
