import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}


  @Get('doctor/:doctorId/date/:date')
  getAppointmentsForDoctorOnDate(
    @Param('doctorId') doctorId: string,
    @Param('date') date: string,
  ): Promise<Appointment[]> {
    
    return this.appointmentService.getAppointmentsForDoctorOnDate(doctorId, date);
  }
  @Post()
  async bookAppointment(@Body() createAppointmentDto: CreateAppointmentDto){
    return this.appointmentService.bookAppointment(createAppointmentDto);
  }


  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(id);
  }
}
