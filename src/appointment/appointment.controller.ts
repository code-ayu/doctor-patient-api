import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';


@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}


  @Get('doctor/:doctorId/date/:date')
  getAppointmentsForDoctorOnDate(
    @Param('doctorId') doctorId: string,
    @Param('date') date: string,
  ) {
    
    return this.appointmentService.getAppointmentsForDoctorOnDate(doctorId, date);
  }
  
  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get('available/:doctorId/:appointmentDate')
  getAvailableTimeSlots(
    @Param('doctorId') doctorId: string, 
    @Param('appointmentDate') appointmentDate: string)
  {
    return this.appointmentService.getAvailableTimeSlots(doctorId , appointmentDate)
  }


  @Post()
  async bookAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto){
    return this.appointmentService.bookAppointment(createAppointmentDto);
  }


  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return await this.appointmentService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(id);
  }
}
