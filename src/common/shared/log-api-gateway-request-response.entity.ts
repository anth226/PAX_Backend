import { Column, Entity, Index } from "typeorm";
import { CommonEntity } from "../common.entity";

@Entity("_log_api_gateway")
export class LogApiGatewayRequestResponseEntity extends CommonEntity {
  @Column({ type: "text", name: "url", nullable: true })
  url: string;

  @Index()
  @Column({ type: "varchar", name: "method", nullable: true, length: 10 })
  method: string;

  @Column({ type: "json", name: "request_json", nullable: true })
  request_json: string;

  @Column({
    type: "longtext",
    name: "host_internal_error_json",
    nullable: true,
  })
  host_internal_error_json: string;

  @Column({ type: "longtext", name: "host_internal_info_json", nullable: true })
  host_internal_info_json: string;

  @Column({ type: "json", name: "response_json", nullable: true })
  response_json: string;

  @Column({ type: "int", name: "client_get_response_code", nullable: true })
  response_code: number;
}
