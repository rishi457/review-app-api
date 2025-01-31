import slugify from 'slugify'
import ProjectService from '../../../services/project'
import { ensureAuthenticated } from '../../../utils/auth'
import { ServerContext } from '../interfaces'
import { CreateProjectData } from './interfaces'
import { Project } from '@prisma/client'
import FormService from '../../../services/form'

const queries = {
  getUserProjects: (_: any, data: any, ctx: ServerContext) => {
    ensureAuthenticated(ctx)
    return ProjectService.getUserProjects(ctx.user?.id!)
  },
  getProjectBySlug: async (
    _: any,
    { slug }: { slug: string },
    ctx: ServerContext
  ) => {
    ensureAuthenticated(ctx)
    const project = await ProjectService.getProjectBySlug({
      slug,
      userId: ctx.user?.id!,
    })
    return project
  },
}
const mutations = {
  createProject: async (
    _: any,
    { data }: { data: CreateProjectData },
    ctx: ServerContext
  ) => {
    ensureAuthenticated(ctx)
    const project = await ProjectService.create({
      data: {
        name: data.name,
        slug: slugify(data.slug),
        ProjectAccessMapping: {
          create: {
            role: 'OWNER',
            user: {
              connect: {
                id: ctx.user?.id!,
              },
            },
          },
        },
      },
    })
    return project
  },
}

const extraResolvers = {
  // Project: {
  //   forms: async (parent: Project, variables: any, ctx: ServerContext) => {
  //     ensureAuthenticated(ctx)
  //     console.log(parent)
  //     return FormService.getFormsByProjectId(parent.id)
  //   },
  // },
}

export const resolvers = { queries, mutations, extraResolvers }
