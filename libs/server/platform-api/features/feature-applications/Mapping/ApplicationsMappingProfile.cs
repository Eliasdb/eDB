using AutoMapper;
using EDb.Domain.Entities;
using EDb.FeatureApplications.DTOs;

namespace EDb.FeatureApplications.Mapping;

public class ApplicationMappingProfile : Profile
{
    public ApplicationMappingProfile()
    {
        CreateMap<Application, ApplicationDto>();
    }
}
