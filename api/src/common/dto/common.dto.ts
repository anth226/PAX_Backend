/**
 * @Description Common DTO
 * @author NrB
 * @version 0.0.1
 * @since 0.0.1
 */
export default abstract class CommonDto {
  id: string;
  uuid: string;
  status: boolean;

  create_by: number | null;
  created_at: Date | null;

  update_by: number | null;
  updated_at: Date | null;

  deleted_by: number | null;
  deleted_at: Date | null;
}
